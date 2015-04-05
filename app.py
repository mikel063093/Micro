from flask import Flask, Response ,  request,render_template,abort,jsonify
                                                        #importamos las librerias nesesarias
                                                       #flask como framework para una app web
                                                       #request para magenar los llamados post y get
                                                       #render_template para servir nuestros archivos html en el navegaodr
                                                       #abort para cancelar peticiones y manejar errores como 404


app = Flask("serverPy") # llamamos al el metodo en la clase flas.Flask que nos retorna un el objeto flask con el que trabajamos

@app.route('/', methods=['GET'])    #anotacion proporcionada por el framework flask que nos permite crear urls limpias y recibir parametros get post deleted
def index():                       
    return render_template('index.html') 

@app.route('/api/secret/<secret_id>', methods=['GET', 'POST'])  
def secret(secret_id):
  #  secret = request.args.get('secret', '')
    if secret_id is None:
        return not_found()
    else:    
        data = {
        'status'  : 'ok',
        'secret': secret_id
        } 
        js = jsonify(data)

        resp = jsonify(data)
        resp.status_code = 200
        return resp;



@app.errorhandler(404)
def not_found(error=None):
    message = {
            'status': 404,
            'message': 'Not Found: ' + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404

    return resp



#app.run() 
app.run(port=int("80"), debug=True) #inicimos nuetro servidor por defecto en localhost, puerto 80 y modo desarollo para ver los logs que nos arroje puerto 80 requiere root
