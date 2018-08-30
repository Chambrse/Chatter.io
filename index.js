
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
var flash = require('connect-flash');


// Other
let randomSentence = require("random-sentence");
var favicon = require('serve-favicon');

// Authentication
var session = require("express-session");
var passport = require("passport");
var expressValidator = require("express-validator");
// var passport = require('./config/passport.js');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var sharedsession = require("express-socket.io-session");


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
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressValidator());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


io.use(sharedsession(session({ secret: "keyboard cat", resave: false, store: new Store({ db: db.sequelize }), saveUninitialized: false })));

// Routes
var indexRouter = require('./routes/index_routes.js');
app.use('/', indexRouter);

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    db.users.findOne({ where: { email: email }, attributes: ['id', 'username', 'hash'] }).then(function (results, err) {

        console.log("id nd hash", results);
        console.log(err);

        if (err) { return done(err); };

        if (!results) {
            console.log("no results from database");
            done(null, false, req.flash('message', "Email not found."));
        } else {

            const hash = results.dataValues.hash.toString();
            console.log(hash);
            bcrypt.compare(password, hash, function (err, response) {
                console.log("test");
                console.log("compare response", response);

                if (err) { return done(err) };

                if (response === true) {
                    return done(null, { user_id: results.dataValues.id, username: results.dataValues.username });
                } else {
                    return done(null, false, req.flash('message', "Incorrect Password."));
                };
            });
        };
    });

}));

// Initialize sequelize, start listening on the port.
let port = process.env.PORT || 3000;
db.sequelize.sync().then(function () {
    server.listen(port, function () {
        console.log('Server listening on port: ' + port);
    });
});

require("./routes/socket_functions")(io);