var localtunnel = require('localtunnel');
var request = require('request');
var macHelper =require('getmac');

var port=80;
var SystemId="";
var tunnel = localtunnel(port,callback);

function callback(err,tunnel){
	   if (err) {
    		console.log(err);
    }else{
		console.log("localtunnel is running on"+tunnel.url);
    macHelper.getMac(function(e,macAddress){
      if(e){

      }else{
        var values ={address:"OK", ip:tunnel.url, mac: macAddress};
        console.log(values);
      request.post({url:'http://micro-ubibus.rhcloud.com/api/auth_pi', 
      form: values}, function(err,response,body){ 
       if (!err && response.statusCode == 200) {
        console.log("ok responde");
          
            console.log(body) 
          }else{

            console.log(response);
            console.log("err statusCode "+response.statusCode);
            console.log(err);
          }
          });
      }
    });


	
    }
}

tunnel.on('close', function() {
    // tunnels are closed
    console.log("localtunnel stop");
     var tunnel = localtunnel(port,callback);
    
});