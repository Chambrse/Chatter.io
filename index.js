// Environment variables
require("dotenv").config();

// Imports
var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
let randomSentence = require("random-sentence");
var session = require("express-session");

var db = require("./models");
// var passport = require('./config/passport.js');


// Make the server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));

// Initialize sequelize, start listening on the port.
let port = process.env.PORT || 3000;
db.sequelize.sync({force: true}).then(function () {
    server.listen(port, function () {
        console.log('Server listening on port: ' + port);
    });
});

//-----------------------------------------------------------------------------
// Routes.
//-----------------------------------------------------------------------------
app.get("/", function (req, res) {
    res.render("login");
});

app.get("/chat", function (req, res) {
    res.render("chat");
});

//-----------------------------------------------------------------------------
// Configure web sockets.
//-----------------------------------------------------------------------------
let messageID = 0;

io.sockets.on("connection", function (socket) {

    messageID++;

    console.log(socket.handshake.query.nickname);

    io.sockets.emit("chat-message", { id: messageID, text: "User Connected", nickname: socket.handshake.query.nickname });

    socket.on("chat-message", function (message) {

        console.log(message);
        messageArray = message.text.split(" ");
        if (messageArray[0] === "admin") {
            switch (messageArray[1]) {
                case "chatsim":
                    simOn = true;
                    chatSim();
                    break;
                case "simOff":
                    simOn = false;
                    break;

                default:
                    break;
            }
        } else {
            messageID++;
            let messageObj = {
                id: messageID,
                text: message.text,
                nickname: message.nickname
            };
            console.log(messageObj);
            io.sockets.emit("chat-message", messageObj);
        };
    });

});


function chatSim() {

    if (simOn) {
        messageID++;
        new Promise(function (resolve, reject) {
            setTimeout(function () {
                io.sockets.emit("chat-message", { id: messageID, text: randomSentence({ min: 4, max: 9 }) });
                resolve();
            }, Math.ceil(Math.random() * 1000));

        }).then(function () {
            chatSim();
        });
    };

};