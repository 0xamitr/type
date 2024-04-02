from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from database_operation import create_user
from flask_bcrypt import Bcrypt

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app)

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
                return jsonify(access_token=access_token)
            else:
                return jsonify({"msg": "Bad username or password"}), 401
        else:
            return jsonify({"msg": "Bad username or password"}), 401
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)