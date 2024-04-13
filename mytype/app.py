from flask import Flask, request, jsonify, make_response
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
import os

expiration_time = datetime.now() + timedelta(days=7)
load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True)

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

jwt = JWTManager(app)
mysql = MySQL(app)
bcrypt = Bcrypt(app)

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
        data = request.get_json()
        cur = mysql.connection.cursor()
        name = data['name']
        print(name)
        password = bcrypt.generate_password_hash(data['password'])
        email = data['email']
        create_user(cur, mysql, name, password, email)
        cur.close()
        return {'message': 'user created successfully'}, 200
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

@app.route('/reset')
def my_scheduled_job():
    print('running cron job')
    cur = mysql.connection.cursor()
    reset(cur, mysql)
    cur.close()
    
if __name__ == '__main__':
    app.run(debug=True)