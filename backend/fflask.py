from flask import Flask, jsonify

app = Flask(__name__)

# Root route
@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
