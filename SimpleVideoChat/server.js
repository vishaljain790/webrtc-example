const WebSocketServer = require('ws').Server,
  express = require('express'),
  https = require('https'),
  app = express(),
  fs = require('fs');
var wss = null, sslSrv = null;
 
app.use(express.static('public'));


var port = process.env.PORT || 3000;

sslSrv = https.createServer(app).listen(port);
console.log("The HTTPS server is up and running");

wss = new WebSocketServer({server: sslSrv});  
console.log("WebSocket Secure server is up and running.");

/** successful connection */
wss.on('connection', function (client) {
  console.log("A new WebSocket client was connected.");
  /** incomming message */
  client.on('message', function (message) {
    /** broadcast message to all clients */
    wss.broadcast(message, client);
  });
});
// broadcasting the message to all WebSocket clients.
wss.broadcast = function (data, exclude) {
  var i = 0, n = this.clients ? this.clients.length : 0, client = null;
  if (n < 1) return;
  console.log("Broadcasting message to all " + n + " WebSocket clients.");
  for (; i < n; i++) {
    client = this.clients[i];
    // don't send the message to the sender...
    if (client === exclude) continue;
    if (client.readyState === client.OPEN) client.send(data);
    else console.error('Error: the client state is ' + client.readyState);
  }
};