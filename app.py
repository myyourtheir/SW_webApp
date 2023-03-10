from flask import Flask, render_template, request

from background import calculate

import json
# print(sys.path)

app = Flask(__name__)
app.config.from_object(__name__)



@app.route('/', methods=["GET", "POST"])
@app.route('/index', methods=["GET", "POST"])
def index():   
    if request.method == "POST":
        jsonData = request.get_json()
        res = json.dumps(calculate(jsonData))
        return res
        
    return render_template('index.html')



if __name__ == "__main__":
    # app.run(host ='0.0.0.0', port =80)
    app.run(debug = True)
    