from flask import Flask, render_template, request
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(__name__)

CORS(app)

@app.route('/', methods=["GET", "POST"])
@app.route('/index', methods=["GET", "POST"])
def index():   
    if request.method == "POST":
        jsonData = request.get_json()
        print(jsonData)
        return {
            'response' : 'I am the response'
        }
    return render_template('index.html')



if __name__ == "__main__":
    app.run(debug=True)