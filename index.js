
// -----------------------
// Imports:
// -----------------------

// Environment variables
require("dotenv").config();

// Server
var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var bodyParser = require('body-parser');
var handlebars = require("express-handlebars");

// Other
let randomSentence = require("random-sentence");

// Authentication
var session = require("express-session");
var passport = require("passport");
var expressValidator = require("express-validator");
// var passport = require('./config/passport.js');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

// -----------------------
// Server & Socket & Database:
// -----------------------

// Models
var db = require("./models");

// Make the server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
Store = require('connect-session-sequelize')(session.Store);
app.use(session({ secret: "keyboard cat", resave: false, store: new Store({ db: db.sequelize }), saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressValidator());

// Routes
var indexRouter = require('./routes/index_routes.js');
app.use('/', indexRouter);

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (username, password, done) {

        db.users.findOne({ where: { email: username }, attributes: ['id', 'hash'] }).then(function (results) {

            console.log(results);

            if (!results) {
                done(null, false);
            }

            const hash = results.dataValues.hash.toString();

            bcrypt.compare(password, hash, function(err, response) {
                console.log("compare response", response);
                if (response === true) {
                    return done(null, {user_id: results.dataValues.id});
                } else {
                    return done(null, false);
                };
            });

        });

    }));

// Initialize sequelize, start listening on the port.
let port = process.env.PORT || 3000;
db.sequelize.sync().then(function () {
    server.listen(port, function () {
        console.log('Server listening on port: ' + port);
    });
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