from flask import Flask, render_template
import requests
import json
import socket


app = Flask(__name__)

@app.route('/')
@app.route('/puz')
def inv():
    res = requests.get('https://animepicsx.net/ajax/getrandompost')
    res = json.loads(res.text)
    return render_template('temp.html', url_=res["img"])


if __name__ == '__main__':
    ip = socket.gethostbyname(socket.gethostname())
    print(ip)
    app.run(port=8080, host=ip)