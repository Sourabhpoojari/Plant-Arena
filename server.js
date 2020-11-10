const express = require('express'),
    app = express();
    connectDB = require('./config/db');

    // DB connection
    connectDB();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("Assets"));
app.use(express.json({extended:false}));

app.get("/", (req, res) => {
    res.redirect("/Landing")
});
app.get("/Landing", (req, res) => {
    res.render("Landing")
})

// Define routes
app.use('/user',require('./routes/user'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));