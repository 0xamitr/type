from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__)

app.config['MYSQL_USER'] = 'sql6695551'
app.config['MYSQL_PASSWORD'] = 'qB9zge7eHz'
app.config['MYSQL_HOST'] = 'sql6.freemysqlhosting.net' 
app.config['MYSQL_DB'] = 'sql6695551'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

@app.route('/')
def index():
    cur = mysql.connection.cursor()

    cur.execute('''SELECT * FROM Example''')
    results = cur.fetchall()
    return str(results)

if __name__ == "__main__":
    app.run(debug=True)