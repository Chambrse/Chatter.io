//-----------------------------------------------------------------------------
// Configure Express.
//-----------------------------------------------------------------------------
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
let randomSentence = require("random-sentence");
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

server.listen(process.env.PORT || 3000, function () {
    console.log('Server listening');
});

//-----------------------------------------------------------------------------
// Routes.
//-----------------------------------------------------------------------------
app.get("/", function (req, res) {
    res.render("chat");
});

//-----------------------------------------------------------------------------
// Configure web sockets.
//-----------------------------------------------------------------------------
let messageID = 0;

io.sockets.on("connection", function (socket) {

    messageID++;

    io.sockets.emit("chat-message", { id: messageID, text: "User Connected." });

    socket.on("chat-message", function (message) {
        messageArray = message.split(" ");
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
                text: message
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