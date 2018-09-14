//-----------------------------------------------------------------------------
// Configure web sockets.
//-----------------------------------------------------------------------------
let randomSentence = require("random-sentence");


module.exports = function (io) {
    let messageID = 0;

    io.sockets.on("connection", function (socket) {

        let username = socket.handshake.session.passport.user.username

        console.log("username", username);
        
        messageID++;
        io.sockets.emit("chat-message", { id: messageID, text: "User Connected", nickname: username });

        socket.on("chat-message", function (message) {

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
                    nickname: username
                };
                io.sockets.emit("chat-message", messageObj);
            };
        });

    });


    function chatSim() {

        if (simOn) {
            messageID++;
            new Promise(function (resolve, reject) {
                setTimeout(function () {
                    io.sockets.emit("chat-message", { id: messageID, text: randomSentence({ min: 4, max: 9 }), nickname: randomSentence({ min: 1, max: 1}) });
                    resolve();
                }, Math.ceil(Math.random() * 1000));

            }).then(function () {
                chatSim();
            });
        };

    };

};