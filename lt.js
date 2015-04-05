var localtunnel = require('localtunnel');
var request = require('request');

var port=80;
var SystemId="";
var tunnel = localtunnel(port,callback);

function callback(err,tunnel){
	   if (err) {
    		console.log(err);
    }else{
		console.log("localtunnel is running on"+tunnel.url);

		request.post({url:'http://ubitaxi-ubibus.rhcloud.com/api/register', 
			form: {id:SystemId, address: tunnel.url}}, function(err,response,body){ 
			 if (!err && response.statusCode == 200) {
			 	console.log("ok responde");
			 	console.log(response);
    				console.log(body) 
  				}else{

  					console.log(response);
  					console.log("err statusCode "+response.statusCode);
  					console.log(err);
  				}
		})
    }
}

tunnel.on('close', function() {
    // tunnels are closed
    console.log("localtunnel stop");
     var tunnel = localtunnel(port,callback);
    
});