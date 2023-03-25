from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from background import calculate
import time

import json
# print(sys.path)

app = Flask(__name__)
app.config.from_object(__name__)
socketio = SocketIO(app)


@socketio.on('anim')
def handle_anim(anim):
    global an
    an = anim

@socketio.on('json')
def handle_json(json_data):
    global an
    an = True
    data = json.loads(json_data)
    generator = calculate(data)
    while True:
        if an:
            res =  json.dumps(next(generator))
            emit('res', res)
            time.sleep(0.1)
        else: 
            time.sleep(0.1)

        



@app.route('/', methods=["GET", "POST"])
@app.route('/index', methods=["GET", "POST"])
def index():   
    # if request.method == "POST":
    #     jsonData = request.get_json()
    #     print(jsonData)
    #     res = json.dumps(calculate(jsonData))
    #     return res
        
    return render_template('index.html')



if __name__ == "__main__":
    # app.run(host ='0.0.0.0', port = 80)
    # app.run(debug = True)
    
    socketio.run(app, host ='0.0.0.0', port = 80)
    