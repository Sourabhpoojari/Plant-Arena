const user = require('./models/user');
const data = require('./data.json');
const { json } = require('body-parser');

const express = require('express'),
    app = express(),
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
app.use(function (req, res, next) {

    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("Assets"));
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
    res.redirect("/Landing")
});
app.get("/Landing", (req, res) => {
    res.render("Landing", { data: data });
})
app.get("/Login", (req, res) => {
    res.render("login")
})
app.get("/Signup", (req, res) => {
    res.render("signup")
})
app.get("/more/:category", (req, res) => {
    var category = req.params.category;
    console.log(category);
    var products = [];
    data.forEach((item) => {
        if (item.category == category) {
            products.push(item)
        }
    })
    if (products) {
        res.render("more", { product: products })
    }
})
app.get("/detail/:id", (req, res) => {
    var id = req.params.id;
    data.forEach((item) => {
        if (item._id == id) {
            res.render("details", { product: item, data: data })
        }
    })
});
app.get("/invoice", (req, res) => {
    res.render("invoice");
});
app.get("/admin", (req, res) => {
    res.render("admin");
});
app.get("/cart", (req, res) => {
    res.render("cart");

});
app.get("/addProducts", (req, res) => {
    res.render("addProducts");
});


// Define routes
app.use('/user', require('./routes/user'));




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));