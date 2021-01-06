const user = require('./models/user');
const express = require('express'),
    app = express(),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    connectDB = require('./config/db');

// DB connection
connectDB();

app.use(require("express-session")({
    secret: "this is Plant Arena",
    resave: false,
    saveUninitialized: false
}));


// Middleware
app.use(flash());
// app.use(function (req, res, next) {

//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success");
//     next();
// })

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("Assets"));
app.use(express.json({ extended: false }));



// **************
// Passport Configuration
// **************
app.use(require('express-session')({
    secret : "*** it's none of your business!!",
    resave : false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.get("/", (req, res) => {
    res.redirect("/Landing")
});
app.get("/Landing", (req, res) => {
    res.render("Landing");
})
app.get("/Login", (req, res) => {
    res.render("login")
})
app.get("/Signup", (req, res) => {
    res.render("signup")
})

// Define routes
app.use('/user', require('./routes/user'));




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));