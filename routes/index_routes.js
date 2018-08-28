var express = require('express');
var db = require("../models");
var router = express.Router();
var expressValidator = require("express-validator");
var passport = require("passport");

// Password Hashing
var bcrypt = require('bcrypt');
const saltRounds = 10;

// router.get('/ibm/:handle', function (req, res, next) {

router.get("/", function (req, res) {
    res.render("register");
});

router.get("/logout", function (req, res) {
    req.logout();
    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
});

router.get("/chat", authenticationMiddleware(), function (req, res) {
    res.render("chat");
});

router.get("/login", function (req, res) {
    res.render('login');
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/chat",
    failureRedirect: "/login"
}));

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {

    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        console.log(JSON.stringify(errors));

        let usernameErrors = [];
        let emailErrors = [];
        let passwordErrors = [];
        let passwordMatchErrors = [];

        errors.forEach(function (element) {
            switch (element.param) {
                case "username":
                    usernameErrors.push(element);
                    break;
                case "email":
                    emailErrors.push(element);
                    break;
                case "password":
                    passwordErrors.push(element);
                    break;
                case "passwordMatch":
                    passwordMatchErrors.push(element);
                default:
            }
        });

        res.render('register', {
            usernameErrors: usernameErrors,
            emailErrors: emailErrors,
            passwordErrors: passwordErrors,
            passwordMatchErrors: passwordMatchErrors,
            inputs: {
                username: req.body.username,
                email: req.body.email
            }
        });
    } else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) throw err;

            db.users.create({
                username: req.body.username,
                email: req.body.email,
                hash: hash
            }).then(function (data) {

                req.login(data.dataValues.id, function (err) {
                    res.redirect("/chat");
                });

            }).catch(function (err) {

                res.render('register', {
                    error: true,
                    inputs: {
                        username: req.body.username,
                        email: req.body.email
                    }
                });

            });
            // res.redirect("/chat");
        });
    };
});

passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }
}

module.exports = router;