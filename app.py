from flask import Flask, render_template
import os


app = Flask(__name__, template_folder='./dist', static_folder='./dist/static')

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1")