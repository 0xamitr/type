from flask import Flask, request, jsonify, make_response, render_template
from flask_mysqldb import MySQL
from flask_cors import CORS
from database_operation import create_user, handle_submit, reset
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from datetime import datetime, timedelta
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from dotenv import load_dotenv
from flask_mail import Mail, Message
from flask_socketio import SocketIO
import os
import random
from flask_socketio import join_room, leave_room
from flask_socketio import send, emit
from flask_socketio import disconnect 


expiration_time = datetime.now() + timedelta(days=7)
load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")

app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST")
app.config['MYSQL_USER'] = os.getenv("MYSQL_USER")
app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD")
app.config['MYSQL_DB'] = os.getenv("MYSQL_DB")
app.config['MYSQL_PORT'] = int(os.getenv("MYSQL_PORT"))
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['MYSQL_SSL_CA'] = '/path/to/your/ca/certificate.pem'
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'typetestme@gmail.com'
app.config['MAIL_PASSWORD'] = os.getenv("APP_PASSWORD")
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)
jwt = JWTManager(app)
mysql = MySQL(app)
bcrypt = Bcrypt(app)

otp_storage = {}
room_storage = {}
socket_to_room = {}
socket_to_username = {}

@app.route('/')
def index():
    cur = mysql.connection.cursor()
    cur.execute('''SELECT * FROM users''')
    results = cur.fetchall() 
    cur.close()
    return {'data': results}, 200

@app.route('/register', methods=['POST'])
def insert():
    try:
        current_time = datetime.now()
        expired_emails = [email for email, data in otp_storage.items() if current_time > data['expiration_time']]
        for email in expired_emails:
            del otp_storage[email]
        print("otp_storage", otp_storage)
        data = request.get_json()
        email = data['email']
        username = data['name']
        cur = mysql.connection.cursor()
        cur.execute('''SELECT * FROM users WHERE username=%s''', (username,))
        result = cur.fetchone()
        if(result):
            return {'exists':'Username already exists'}, 409
        
        cur.execute('''SELECT * FROM users WHERE email=%s''', (email,))
        result = cur.fetchone()
        if(result):
            return {'exists':'Email already exists'}, 409
        
        # email and username are unique

        #create token, send email
        token = random.randint(1000, 9999)
        print(token)
        msg = Message("Hello",
            sender="typetestme@gmail.com",
            recipients=[email])
        expiration_time = datetime.now() + timedelta(minutes=5)
        otp_storage[email] = {'otp': token, 'expiration_time': expiration_time}
        msg.html = render_template("confirm_email.html", token=token)
        mail.send(msg)
        
        ## return response so that user can input otp
        return jsonify({"success": True})

    except Exception as e:
        return {'error': str(e)}, 400
    
@app.route('/realregister', methods=['POST'])
def realregister():
    try:
        print("ok")
        print("otp_storage", otp_storage)
        data = request.get_json()
        user_email = data['email']
        user_otp = data['otp']
        username = data['name']
        cur = mysql.connection.cursor()
        current_time = datetime.now()
        expired_emails = [email for email, data in otp_storage.items() if current_time > data['expiration_time']]
        for email in expired_emails:
            del otp_storage[email]
        print("otp_storage after", otp_storage)

        # verify token
        print(user_email)
        print("Keys in otp_storage:", otp_storage.keys())

        if user_email in otp_storage:
            print(user_otp)
            print(otp_storage[user_email]['otp'])
            if int(user_otp) == otp_storage[user_email]['otp']:  # Corrected OTP comparison
                #create user
                password = bcrypt.generate_password_hash(data['password'])
                email = data['email']
                create_user(cur, mysql, username, password, email)
                del otp_storage[user_email]  # Remove the used OTP
                cur.close()
                return jsonify({'success': True, 'message': 'user created successfully'}), 200
            else:
                return jsonify({'success': False, 'message': 'wrong otp'}), 403

        cur.close()
        return jsonify({'success': False, "message": "email not found"}), 403
    except Exception as e:
        return {'error': str(e)}, 400    
    
@app.route('/login', methods=['POST'])
def check():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']
        
        cur = mysql.connection.cursor()
        cur.execute('''SELECT password FROM users WHERE email = %s''', (email,))
        result = cur.fetchone()
        cur.close()
        print(result['password'])
        if result:
            hashed_password = result['password']
            if bcrypt.check_password_hash(hashed_password, password):
                access_token = create_access_token(identity=email, expires_delta=timedelta(days=7))
                response = make_response(jsonify({'success': True}))
                response.set_cookie('access_token_cookie', access_token, expires=expiration_time, httponly=True, secure=True, samesite='None')
                return response
            else:
                return jsonify({'success': False, 'message': 'Authentication failed'}), 401
        else:
            return jsonify({"msg": "Bad username or password"}), 401
    except Exception as e:
        return {'error': str(e)}, 500

@app.route('/logout')
def logout():
    response = jsonify({'logout': True})
    response = make_response(response)
    response.set_cookie('access_token_cookie', '', expires=0, httponly=True, secure=True, samesite='None')
    return response

@jwt_required
@app.route('/protected')
def protected():
    try:
        verify_jwt_in_request()
        email = get_jwt_identity()
        cur = mysql.connection.cursor()
        cur.execute('''SELECT id, username, email FROM users WHERE email = %s'''
        , [email])
        user_data = cur.fetchone()
        cur.execute('''SELECT text_tests, text_tests_today, cumm_text_accuracy, cumm_text_accuracy_today, cumm_text_wpm, cumm_text_wpm_today, highest_text_wpm_ever, highest_text_wpm_today FROM users WHERE email = %s'''
        , [email])
        text_data = cur.fetchone()
        cur.execute('''SELECT code_tests, code_tests_today, cumm_code_accuracy, cumm_code_accuracy_today, cumm_code_wpm, cumm_code_wpm_today, highest_code_wpm_ever, highest_code_wpm_today FROM users WHERE email = %s'''
        , [email])
        code_data = cur.fetchone()
        cur.close()
        return jsonify({
            'user_data': user_data,
            'text_data': text_data,
            'code_data': code_data
        })
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500

@jwt_required
@app.route('/check-login')
def checkLogin():
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        if get_jwt_identity():
            return jsonify(logged_in=True, user= user_id), 200
    except InvalidTokenError as e:
        return jsonify(logged_in=False), 200
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.get_json()
        wpm = data['wpm']
        accuracy = data['accuracy']
        print("check" , accuracy)
        user = data['user']
        iscode = data['iscode']
        cur = mysql.connection.cursor()
        handle_submit(cur, mysql, wpm, accuracy, user, iscode)
        cur.close()
        return jsonify({"message": "ok"}), 200
    except Exception as e:
        app.logger.error("Unexpected error: {}".format(e))
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/forgotpassword', methods=['POST'])
def forgotpass():
    try:
        data = request.get_json()
        email = data['email']
        cur = mysql.connection.cursor()
        cur.execute('''SELECT * FROM users WHERE email=%s''', (email,))
        result = cur.fetchone()
        if not result:
            cur.close()
            return {'success': False, 'mesasge':'Email does not  exists'}, 409
        token = random.randint(1000, 9999)
        print(token)
        msg = Message("Hello",
            sender="typetestme@gmail.com",
            recipients=[email])
        expiration_time = datetime.now() + timedelta(minutes=5)
        otp_storage[email] = {'otp': token, 'expiration_time': expiration_time}
        msg.html = render_template("confirm_email.html", token=token)
        mail.send(msg)
        
        return jsonify({'success': True, "message": "ok"}), 200
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/forgotpasswordotp', methods=['POST'])
def forgotpassotp():
    try:
        data = request.get_json()
        user_email = data['email']
        user_otp = data['otp']
        current_time = datetime.now()
        expired_emails = [email for email, data in otp_storage.items() if current_time > data['expiration_time']]
        for email in expired_emails:
            del otp_storage[email]

        # verify token
        if user_email in otp_storage:
            if int(user_otp) == otp_storage[user_email]['otp']: 
                return jsonify({'success': True, "message": "ok"}), 200
        return jsonify({'success': False}), 400
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/resetpassword', methods=['POST'])
def resetpass():
    try:
        data = request.get_json()
        email = data['email']
        cur = mysql.connection.cursor()
        password = bcrypt.generate_password_hash(data['password'])

        cur.execute("UPDATE users SET password = %s WHERE email = %s", (password, email))
        mysql.connection.commit()

        cur.close()
        return jsonify({'success': True}), 200

    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/reset', methods=['GET'])
def my_scheduled_job():
    try:
        print('running cron job')
        cur = mysql.connection.cursor()
        reset(cur, mysql)
        cur.close()
        return jsonify({"message": "ok"}), 200
    except Exception as e:
        app.logger.error("Unexpected error: {}".format(e))
        return jsonify({'error': 'Internal Server Error'}), 500
    
@jwt_required
@app.route('/getuser')
def getUser():
    try:
        verify_jwt_in_request()
        email = get_jwt_identity()
        cur = mysql.connection.cursor()
        cur.execute('''SELECT username FROM users WHERE email = %s'''
        , [email])
        username = cur.fetchone()
        return jsonify({'success': True, 'username': username})
    except Exception as e:
        return jsonify({'error': 'Internal Server Error'}), 500


@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('create-room')
def handle_room_creation(data):
    socket_to_username[request.sid] = data['username']
    username = data['username']
    room_name = str(random.randint(1000, 9999))
    namespace = '/'
    room_exists = room_name in socketio.server.manager.rooms.get(namespace, {})
    join_room(room_name)
    if(not room_exists):
        socket_to_room[request.sid] = room_name
        room_storage[room_name] = {
            'room_name': room_name,
            'status': False,
            'text_length': 0,
            'joinies': [{
                'id': request.sid,
                'username': username,
                'status': False,
                'text_length': 0
            }]
        }
        emit('update', {'data': room_storage[room_name]}, room=room_name)
    return room_name

@socketio.on('join-room')
def handle_room_join(data):
    username = data['username']
    room_name = data['room_name']
    socket_to_username[request.sid] = username
    namespace = '/'
    room_exists = room_name in socketio.server.manager.rooms.get(namespace, {})
    if(room_exists):
        existing_id = []
        for user in room_storage[room_name]['joinies']:
            existing_id.append(user['id'])
        if request.sid not in existing_id:
            joinies = {
                'id': request.sid,
                'username': username,
                'status': False,
                'text_length': 0
            }
            socket_to_room[request.sid] = room_name
            room_storage[room_name]['joinies'].append(joinies)
            join_room(room_name)
            print(f'User {username} joined room: {room_name}')
        emit('update', {'data': room_storage[room_name]}, room=room_name)
        # if(request.sid not in socketio.server.manager.rooms[namespace][room_name]):

    else:
        print(f'Room {room_name} does not exist')

@socketio.on('change-status')
def handle_change_status(data):
    room_name = data['room_name']
    id = data['id']
    for user in room_storage[room_name]['joinies']:
        if user['id'] == id:
            user['status'] = not user['status']
            break
    cnt = 0
    for user in room_storage[room_name]['joinies']:
        if user['status'] == True:
            cnt += 1
    if cnt == len(room_storage[room_name]['joinies']):
        room_storage[room_name]['status'] = True
        todo = 'this is a test so shut the fuck and type it you asshole'
        room_storage[room_name]['text_length'] = len(todo)
        emit('start-test', {'text': todo}, room=room_name)
    emit('update', {'data': room_storage[room_name]}, room=room_name)

@socketio.on('change-text')
def handle_change_text(data):
    room_name = data['room_name']
    text_length = data['text_length']
    for user in room_storage[room_name]['joinies']:
        if user['id'] == request.sid:
            user['text_length'] = text_length
            break
    emit('update', {'data': room_storage[room_name]}, room=room_name)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
    room_name = socket_to_room[request.sid]
    username = socket_to_username[request.sid]
    leave_room(room_name)
    if room_name in room_storage:
        for user in room_storage[room_name]['joinies']:
            if user['id'] == request.sid:
                room_storage[room_name]['joinies'].remove(user)
                break
        if not room_storage[room_name]['joinies']:
            del room_storage[room_name]
        emit('update', {'data': room_storage[room_name]}, room=room_name)
    del socket_to_room[request.sid]
    del socket_to_username[request.sid]

if __name__ == '__main__':
    socketio.run(app)