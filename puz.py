from flask import Flask, render_template
import requests
import json
import os


app = Flask(__name__)

@app.route('/')
@app.route('/puz')
def inv():
    res = requests.get('https://animepicsx.net/ajax/getrandompost')
    res = json.loads(res.text)
    return render_template('temp.html', url_=res["img"])


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
