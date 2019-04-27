from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
@app.route('/project/<project_name>')
def index(project_name=None):
    return render_template('index.html', project_name=project_name)


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')