from flask import Flask
from flask_socketio import SocketIO, emit, send

from db import addMessage, getMessages

app = Flask(__name__)
app.config["SECRET_KEY"] = "louai"
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('chat')
def chat(data):
    convId = data["convId"]
    print(convId)
    message = data["message"]
    userId = data["userId"]
    id = addMessage(convId, message, userId)
    messages = getMessages(convId=convId)
    emit(convId, messages, broadcast=True)


@socketio.on('get')
def get(data):
    convId = data['convId']
    msgs = getMessages(convId)
    emit(convId, msgs)


if __name__ == "__main__":
    socketio.run(app, port=8000,  host="0.0.0.0")
