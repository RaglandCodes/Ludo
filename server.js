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

let colourOrder = ["green", "red", "blue", "yellow"];
let pieceData = [
    {
        name: "green0",
        colour: "green",
        locationX: 7,
        locationY: 7,
    }
]
let players = [];
io.on('connection', function (socket) {
  players.push({
      id: socket.id,
      colour:""
  })
 console.log(players.length);
 io.to(socket.id).emit("id", {id: socket.id})
 if(players.length == 4)
 {
     for(i=0; i<players.length; i++)
     {
         players[i]['colour'] = colourOrder[i];
         
     }
 }

 io.sockets.emit("reRender", {players: players});
  socket.on("disconnect", () => {
    players = players.filter(player => player['id'] != socket.id);
    console.log(players.length);
    io.sockets.emit("reRender", {players: players});
  });
});