var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var data = require("../data.json")



//signup page route
router.get("/signup", (req, res) => {
    res.render("signup");
})
//signup page post route
router.post("/signup", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var phone = req.body.phone;
    // console.log(username);
    // console.log(password);
    User.register(new User({ username: username, email: email, phone: phone }), password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            console.log("cannot signup new user");
            res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "signup successful welcome to Plant Arena " + user.username);
            console.log("succesfully signedup new user");
            res.redirect("/Landing");
        })
    })
});

//login route
router.get("/login", (req, res) => {
    res.render("login");
})

router.post("/login",
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error(err);
                return res.redirect("/Login");
            }
            if (!user) {
                return res.redirect("/Login");
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error(err);
                    req.flash("error", "Invalid Credentials");
                    return res.redirect("/Login");
                }
                if (user.isAdmin) {
                    req.flash("success", "Login successful. Welcome Admin " + user.username)
                    return res.redirect('/admin')
                } else {
                    req.flash("success", "Login successful. Welcome back " + user.username)
                    return res.redirect("/Landing");
                }
            });
        })(req, res, next);
    }

);



//logout route
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged you out")
    res.redirect("/Landing")
})
module.exports = router;