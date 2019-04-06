let express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//app.use(express.static('public'));
server.listen(5656, () => {
    console.log("Running @ port 5656");
    
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'w0rld' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});