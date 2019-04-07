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
    number: "0",
    locationX: 100,
    locationY: 435,
    locationDescription: "outside"
  },
  {
    name: "green1",
    colour: "green",
    number: "1",
    locationX: 100,
    locationY: 365,
    locationDescription: "outside"
  },
  {
    name: "green2",
    number: "2",
    colour: "green",
    locationX: 135,
    locationY: 400,
    locationDescription: "outside"
  },
  {
    name: "green3",
    number: "3",
    colour: "green",
    locationX: 65,
    locationY: 400,
    locationDescription: "outside"
  },
  {
    name: "red0",
    number: "0",
    colour: "red",
    locationX: 100,
    locationY: 65,
    locationDescription: "outside"
  },
  {
    name: "red1",
    colour: "red",
    number: "1",
    locationX: 100,
    locationY: 135,
    locationDescription: "outside"
  },
  {
    name: "red2",
    colour: "red",
    number: "2",
    locationX: 135,
    locationY: 100,
    locationDescription: "outside"
  },
  {
    name: "red3",
    colour: "red",
    number: "3",
    locationX: 65,
    locationY: 100,
    locationDescription: "outside"
  },
  {
    name: "blue0",
    colour: "blue",
    number: "0",
    locationX: 400,
    locationY: 65,
    locationDescription: "outside"
  },
  {
    name: "blue1",
    colour: "blue",
    number: "1",
    locationDescription: "outside",
    locationX: 400,
    locationY: 135
  },
  {
    name: "blue2",
    colour: "blue",
    number: "2",
    locationDescription: "outside",
    locationX: 365,
    locationY: 100
  },
  {
    name: "blue3",
    colour: "blue",
    number: "3",
    locationDescription: "outside",
    locationX: 435,
    locationY: 100
  },
  {
    name: "yellow0",
    colour: "yellow",
    number: "0",
    locationDescription: "outside",
    locationX: 400,
    locationY: 435
  },
  {
    name: "yellow1",
    colour: "yellow",
    number: "1",
    locationDescription: "outside",
    locationX: 400,
    locationY: 365
  },
  {
    name: "yellow2",
    colour: "yellow",
    number: "2",
    locationDescription: "outside",
    locationX: 365,
    locationY: 400
  },
  {
    name: "yellow3",
    colour: "yellow",
    number: "3",
    locationDescription: "outside",
    locationX: 435,
    locationY: 400
  }
];
let players = [];
let diceNumber = 0;
let turn = 0;
let movesLeft = 0;
const path = [
  [215, 483], // green starts here
  [215, 448],
  [215, 413],
  [215, 378],
  [215, 343],
  [215, 310],

  [185, 283],
  [151, 283],
  [116, 283],
  [82, 283],
  [47, 283],
  [13, 283],

  [15, 247][(15, 214)], // red starts
  [50, 214],
  [85, 214],
  [120, 214],
  [154, 214],
  [190, 214]
];
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
      colour: players[turn]["colour"],
      diceState: 0
    });
    console.log(players[turn]["colour"]);
  }

  socket.on("pieceClick", pieceClickData => {
    console.log(pieceClickData);
    movesLeft -= 1;
    console.log(movesLeft);

    if (movesLeft == 0) {
      if (turn == 3) turn = 0;
      else turn += 1;
    }
    console.log(`turn = ${turn}`);
    
    io.sockets.emit("turn", {
      turn: players[turn]["id"],
      colour: players[turn]["colour"],
      diceState: diceNumber,
      movesLeft: movesLeft
    });

    io.sockets.emit("reRender", { players: players, pieceData: pieceData });
  });
  socket.on("diceRoll", () => {
    console.log("dice was rolled");

    diceNumber = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    movesLeft = diceNumber;
    console.log(`turn = ${turn}`);
    io.sockets.emit("turn", {
      turn: players[turn]["id"],
      colour: players[turn]["colour"],
      diceState: diceNumber
    });
    console.log(players[turn]["colour"]);
    io.sockets.emit("reRender", { players: players, pieceData: pieceData });
  });
  io.sockets.emit("reRender", { players: players, pieceData: pieceData });

  socket.on("disconnect", () => {
    players = players.filter(player => player["id"] != socket.id);

    console.log(`Active players = ${players.length}`);

    io.sockets.emit("reRender", { players: players, pieceData: pieceData });
  });
});
