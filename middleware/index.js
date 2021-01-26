var User = require('../models/user');
//all middleware goes here
var middlewareObj = {};


middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("error", "you need to be logged in");
    res.redirect("/login");
}

middlewareObj.isAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        User.findById(req.user._id, (err, foundUser) => {
            if (err) {
                req.flash("error", "User not found")
                res.redirect("back");
            } else {
                if (foundUser.isAdmin) {
                    return next();
                } else {
                    req.flash("error", "permission denaied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "you need to be logged in");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;