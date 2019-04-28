import os
import redis
import pickle
import uuid

from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room, emit


REDIS_URL = os.environ['REDIS_URL']

app = Flask(__name__)
socketio = SocketIO(app)
redis = redis.from_url(os.environ.get("REDIS_URL"))

EMPTY_PROJECT = {
    'numChairs': 10,
    'chairs': ["" for e in range(10)]
}

def get_val(value):
    return pickle.loads(redis.get(value)) if redis.get(value) else EMPTY_PROJECT

def set_val(key, value):
    return redis.set(key, pickle.dumps(value))

@app.route('/')
@app.route('/project/<project_name>')
def index(project_name=None):
    return render_template('index.html', project_name=project_name)

@socketio.on('connect')
def on_connect():
    print('Connected')
    emit('connected', str(uuid.uuid4()))

@socketio.on('disconnect')
def on_disconnect():
    print('Disconnected')

@socketio.on('join')
def on_join_project(data):
    project = data['project']
    join_room(project)
    emit('acc', data)
    emit('update', {'uuid': 'server', **get_val(project)})

@socketio.on('leave')
def on_leave_project(data):
    project = data['project']
    leave_room(project)
    emit('acc', "ok")

@socketio.on('update')
def on_update_project(data):
    set_val(data['project'], data['data'])
    to_return = {
        'uuid': data['uuid'],
        **data['data']
    }
    emit('update', to_return, room=data['project'])

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)
    #app.run(debug=True, host='127.0.0.1')