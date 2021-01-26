var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    User = require('./models/user'),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStratergy = require("passport-local"),
    connectDB = require('./config/db'),
    back = require('express-back');


//mongoDB connection
// DB connection
connectDB();
//requiring all routes
var authroutes = require("./routes/auth");
//express-session setup
app.use(require("express-session")({
    secret: "this is yelpcamp application",
    resave: false,
    saveUninitialized: false
}));
app.use(back());


//initail setup
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("Assets"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
//passport registration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for user login
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//to get routes
app.use(authroutes);
app.get('/', (req, res) => {
    res.redirect('/Landing');
});
app.use('/admin', require('./routes/admin'));
app.use('/cart',require('./routes/cart'));
app.use('/Landing', require('./routes/product'));
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));