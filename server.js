let express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

//app.use(express.static('public'));
server.listen(5656, () => {
  console.log("Running @ port 5656");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

let colourOrder = ["green", "red", "blue", "yellow"];
let pieceData = [
  {
    name: "green0",
    colour: "green",
    locationX: 100,
    locationY: 435
  },
  {
    name: "green1",
    colour: "green",
    locationX: 100,
    locationY: 365
  },
  {
    name: "green2",
    colour: "green",
    locationX: 135,
    locationY: 400
  },
  {
    name: "green3",
    colour: "green",
    locationX: 65,
    locationY: 400
  },
  {
    name: "red0",
    colour: "red",
    locationX: 100,
    locationY: 65
  },
  {
    name: "red1",
    colour: "red",
    locationX: 100,
    locationY: 135
  },
  {
    name: "red2",
    colour: "red",
    locationX: 135,
    locationY: 100
  },
  {
    name: "red3",
    colour: "red",
    locationX: 65,
    locationY: 100
  },
  {
    name: "blue0",
    colour: "blue",
    locationX: 400,
    locationY: 65
  },
  {
    name: "blue1",
    colour: "blue",
    locationX: 400,
    locationY: 135
  },
  {
    name: "blue2",
    colour: "blue",
    locationX: 365,
    locationY: 100
  },
  {
    name: "blue3",
    colour: "blue",
    locationX: 435,
    locationY: 100
  },
  {
    name: "yellow0",
    colour: "yellow",
    locationX: 400,
    locationY: 435
  },
  {
    name: "yellow1",
    colour: "yellow",
    locationX: 400,
    locationY: 365
  },
  {
    name: "yellow2",
    colour: "yellow",
    locationX: 365,
    locationY: 400
  },
  {
    name: "yellow3",
    colour: "yellow",
    locationX: 435,
    locationY: 400
  },
];
let players = [];
let turn = 0;

io.on("connection", function(socket) {
  players.push({
    id: socket.id,
    colour: ""
  });
  console.log(`Active players = ${players.length}`);
  io.to(socket.id).emit("id", { id: socket.id });
  if (players.length == 4) {
    for (i = 0; i < 4; i++) {
      players[i]["colour"] = colourOrder[i];
    }

    io.sockets.emit("turn", {
      turn: players[turn]["id"],
      colour: players[turn]["colour"]
    });
    console.log(players[turn]["colour"]);
  }

  socket.on("diceRoll", () => {
    console.log("dice was rolled");

    if (turn == 3) turn = 0;
    else turn += 1;

    let diceNumber = Math.floor(Math.random() * (6 - 1 + 1)) + 1;

    console.log(`turn = ${turn}`);
    io.sockets.emit("turn", {
      turn: players[turn]["id"],
      colour: players[turn]["colour"],
      diceState: diceNumber
    });
    console.log(players[turn]["colour"]);
    io.sockets.emit("reRender", { players: players });
  });
  io.sockets.emit("reRender", { players: players, pieceData:pieceData });
  
  socket.on("disconnect", () => {
    players = players.filter(player => player["id"] != socket.id);
    
    
    console.log(`Active players = ${players.length}`);
    
    io.sockets.emit("reRender", { players: players });
  });
});
