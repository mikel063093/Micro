var localtunnel = require('localtunnel');
var request = require('request');
var macHelper =require('getmac');
var express = require('express');
var exec = require('child_process').exec;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var Canvas = require('canvas');
var board = require('rpi-rgb-led-matrix');

var width = 64
var height = 32
board.start(32,2,true)

var canvas = new Canvas(width, height)
var context = canvas.getContext('2d');
var textDirection ="right";
var textXpos = 5;
var text;

// Verdana looks decent at low resolutions
context.font = "12px Arial";
rederOnDisplay("Hola Mundo.............................");
function rederOnDisplay(str){
  process.nextTick(function(){
    board.clear();
    text=str;
    setInterval(animate, 30);

//    context.fillStyle = "black"
//    context.fillRect(0, 0, 0, 0)
// //   context.rotate(.5) 	
//     context.fillStyle = "#FF0000"
    
//     context.measureText(str);
//     textDirection = "right"

//     context.fillText(str, 0, 16)
//     board.drawCanvas(context, width, height)
    console.log(board)  
    console.log(context)  
  })  
}
  function animate() {  
         
            // Clear screen
            context.clearRect(0, 0, 0, 0);
           // context.globalAlpha = 1;
            context.fillStyle = "black"
            context.fillRect(0, 0, 0, 0)    

            var metrics = context.measureText(text);
            var textWidth = metrics.width;

            if (textDirection == "right") {
                textXpos += 10;

                if (textXpos > 500 - textWidth) {
                    textDirection = "left";
                }
            }
            else {
                textXpos -= 10;

                if (textXpos < 10) {
                    textDirection = "right";
                }                    
            }

            context.font = '12px Arial';
            context.fillStyle = '#FF0000';
            context.translate(20,-40);
            //context.strokeStyle = 'rgba(255,0,0,255)';
            
            context.translate(20,-40);
            context.fillText(text, 0, 16);
            context.beginPath();
            context.stroke();
            //console.log('<img src="' + canvas.toDataURL() + '" />');
            board.drawCanvas(context, width, height)    
}

var port=8080;
var SystemId="";

var app = express();
app.use(bodyParser());
app.use(methodOverride());

var tunnel;
registerLocalTunnel();
var server = require('http').createServer(app);
server.listen(port, function () {
   console.log("listen on port"+port);
});
app.get("/api/secret/:secret_id",cb_secret_id);

function cb_secret_id(req,res,next){
  var secret_id= req.params.secret_id;
  if(secret_id!=undefined && secret_id!=null ){
     data = {
        'status'  : 'ok',
        'secret': secret_id
        };
   // var command="sudo python message.py  "+secret_id; 
    //console.log("execute "+command);
    //exec(command,cb_cli_command);
    rederOnDisplay(secret_id)
    console.log(data);   
    res.json(data);
    next();
  }else{
    res.sendStatus(403);
    next();
  }
}
function cb_cli_command(error,stdout,stderr){
  if(error){
    console.log(error)
  }
  if(stdout!=null){
    console.log(stdout)
  }
  if(stderr!=null){
    console.log(stderr)
  }
}

function registerLocalTunnel(){
   process.nextTick(function(){
   tunnel = localtunnel(port,callback_localtunnel);}
  // tunnel.close(function() { registerLocalTunnel()});
   );

}
function callback_localtunnel(err,tunnel){
   process.nextTick(function(){
	   if (err) {
        console.log(err);
        registerLocalTunnel();
    		
      }else{
		  console.log("localtunnel is running on"+tunnel.url);
      macHelper.getMac(cb_registerMacPy);
    }
  });
}
function cb_registerMacPy(e,macAddress){
  process.nextTick(function(){
    if(e){

    }else{
      var values ={address:"OK", ip:tunnel.url, mac: macAddress};
      request.post({url:'http://micro-ubibus.rhcloud.com/api/auth_pi',form: values}, cb_registerPy);
    }
  });
}

function cb_registerPy(err,response,body){
  process.nextTick(function(){
    if (!err && response.statusCode == 200) {
            console.log("ok responde");      
            console.log(body) 
          }else{

            console.log(response);
            console.log("err statusCode "+response.statusCode);
            console.log(err);
            registerLocalTunnel();

          }
  });        
}



