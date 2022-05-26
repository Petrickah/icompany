from flask import Flask, send_from_directory, Request, Response, make_response, request
import requests
import json
import os

app = Flask(__name__, static_folder='build')
port = 5000

url_search_api  = "https://webservicesp.anaf.ro/PlatitorTvaRest/api/v6/ws/tva"
url_balance_api = "https://webservicesp.anaf.ro/bilant"

def send_response(result):
    response:Response = make_response(json.dumps(result))
    response.headers['Content-Type'] = 'application/json'
    return response

@app.route('/api/v1/bilant', methods=['GET'])
def balance():
    req: Request = request # Cast the request variable to Request type
    res = requests.get(
        url=url_balance_api, 
        params={
            'an' : req.args['an'], 
            'cui': req.args['cui'] 
        }
    )
    if res.status_code == 200:
        data = json.loads(res.text)
        if len(data["i"]) > 0:
            return send_response(data)
    return send_response({
        "cod": 404,
        "message": "Not Found"
    })
    

@app.route('/api/v1/cauta', methods=['GET'])
def search():
    req: Request = request # Cast the request variable to Request type
    res = requests.post(
        url=url_search_api, 
        headers={"Content-Type": 'application/json'}, 
        json = [{
            'cui': req.args['cui'],
            'data': req.args['data']
        }]
    )
    if res.status_code == 200:
        data = json.loads(res.text)
        if data["found"][0]['denumire']:
            found = data["found"][0]
            an = int(req.args['data'].split('-')[0]) - 1
            cui = req.args['cui']
            return send_response({
                "cod": data["cod"],
                "message": data["message"],
                "url": f"http://127.0.0.1:{port}/api/v1/bilant?an={an}&cui={cui}",
                "date": {
                    "cui": found["cui"],
                    "data": found["data"],
                    "denumire": found["denumire"],
                    "adresa": found["adresa"],
                    "nrRegCom": found["nrRegCom"],
                    "stare": found["stare_inregistrare"],
                    "scopTVA": found["scpTVA"],
                    "data_inceput_scopTVA": found["data_inceput_ScpTVA"]
                }
            })
    return send_response({
        "cod": 404,
        "message": "Not Found"
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    if path != '' and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(port=port, use_reloader=True, threaded=True)