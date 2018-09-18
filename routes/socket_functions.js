//-----------------------------------------------------------------------------
// Configure web sockets.
//-----------------------------------------------------------------------------
let randomSentence = require("random-sentence");
var db = require("../models");
let randomColor = require('randomcolor');


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

                function threadmanager() {
                    return new Promise(function (resolve, reject) {
                        let thread;
                        if (message.selectedMessage === 0) {
                            thread = null;
                            resolve(thread);
                        } else {
                            db.messages.findOne({ where: { id: message.selectedMessage }, attributes: ['id', 'messageBody', 'thread'] }).then(function (results, err) {
                                if (results.dataValues.thread) {
                                    thread = results.dataValues.thread;
                                    resolve(thread)
                                } else {

                                    db.threads.create({
                                        name: results.dataValues.messageBody,
                                        color: randomColor({
                                            luminosity: 'light',
                                            format: 'rgba',
                                            alpha: 0.5 // e.g. 'rgba(9, 1, 107, 0.5)',
                                        })
                                    }).then(function (results, err) {
                                        thread = results.dataValues.name;
                                        resolve(thread);
                                    });
                                };
                            })

                        }
                    });
                };
                
                threadmanager().then(function (thread) {

                    db.messages.create({
                        messageBody: message.text,
                        sender: username,
                        thread: thread
                    }).then(function (data) {
                        console.log(data.dataValues);
                        let messageObj = {
                            id: data.dataValues.id,
                            text: data.dataValues.messageBody,
                            nickname: data.dataValues.sender,
                            replyto: message.selectedMessage
                        };
                        io.sockets.emit("chat-message", messageObj);
                    }).catch(function (err) {
                        console.log(err);
                    });
                });

                //database call!

            };
        });

    });


    function chatSim() {

        if (simOn) {
            messageID++;
            new Promise(function (resolve, reject) {
                setTimeout(function () {
                    io.sockets.emit("chat-message", { id: messageID, text: randomSentence({ min: 4, max: 9 }), nickname: randomSentence({ min: 1, max: 1 }) });
                    resolve();
                }, Math.ceil(Math.random() * 1000));

            }).then(function () {
                chatSim();
            });
        };

    };

};