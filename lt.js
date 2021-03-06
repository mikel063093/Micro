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
var textXpos = 0;
var text;
var x=true;

// Verdana looks decent at low resolutions
context.font = "12px Arial";
rederOnDisplay("");
function rederOnDisplay(str){
  process.nextTick(function(){
    board.clear();
    textXpos = 0;
    text=str;
    setInterval(animate, 26);
 

//    context.fillStyle = "black"
//    context.fillRect(0, 0, 0, 0)
// //   context.rotate(.5) 	
//     context.fillStyle = "#FF0000"
    
//     context.measureText(str);
//     textDirection = "right"

//     context.fillText(str, 0, 16)
//     board.drawCanvas(context, width, height)
  
  })  
}
  function animate() { 
     
   //console.log("anterior textXpos"+textXpos);
            // Clear screen
            context.clearRect(0, 0, 150, 150);
           // context.globalAlpha = 1;
            context.fillStyle = "#000000"
            context.fillRect(0, 0, 150, 150)    

            var metrics = context.measureText(text);

            var textWidth = metrics.width;

            // canvas = new Canvas(textWidth, height)
            // context = canvas.getContext('2d');

              // console.log(board)  
           // console.log(context) 
            //console.log({metrics_:metrics})
            //console.log("textWidth "+textWidth );

            if (textDirection == "right") {
                textXpos -= 10;
                //console.log("textXpo "+textXpos);

                if (textXpos < textWidth*(-1)) {
                    textXpos=0;
                   // textDirection = "left";
                }
            }
            // else {
            //     textXpos -= 5;
            //     console.log("textXpo "+textXpos);
            //     if (textXpos < 5) {
            //         textDirection = "right";
            //     }                    
            // }
           // context.stroke();
            context.font = '14px Arial';
            context.fillStyle = '#FF0000';
            //context.translate(20,-40);
            //context.strokeStyle = 'rgba(255,0,0,255)';
            
            //
            if(x){
              x=false;
           // context.fillText(text, textXpos, 16);}
              }
            else{
              x=true;
              //context.fillText("Mike", textXpos, 16);
            }
            //context.translate(textXpos,0);
            context.fillText(text, textXpos, 20);
        

            // context.beginPath();
            // c
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
      var values ={address:"YANACOAS", ip:tunnel.url, mac: macAddress};
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



