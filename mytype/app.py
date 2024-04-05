from flask import Flask, request, jsonify, make_response
from flask_mysqldb import MySQL
from flask_cors import CORS
from database_operation import create_user
from flask_bcrypt import Bcrypt

from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
from flask_jwt_extended import jwt_required, get_jwt_identity, unset_jwt_cookies, verify_jwt_in_request
from datetime import datetime, timedelta

expiration_time = datetime.now() + timedelta(days=7)

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS with credentials support

app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config['MYSQL_USER'] = 'sql6695551'
app.config['MYSQL_PASSWORD'] = 'qB9zge7eHz'
app.config['MYSQL_HOST'] = 'sql6.freemysqlhosting.net' 
app.config['MYSQL_DB'] = 'sql6695551'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

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
                access_token = create_access_token(identity=email)
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
    unset_jwt_cookies(response)
    return response

@jwt_required
@app.route('/protected')
def protected():
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        app.logger.info("User ID: {}".format(user_id))
        return jsonify({'user_id': user_id}), 200
    except Exception as e:
        app.logger.error("Error retrieving user identity: {}".format(str(e)))
        return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(debug=True)