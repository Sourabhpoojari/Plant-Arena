
const express = require('express'),
    app = express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("Assets"));

app.get("/", (req, res) => {
    res.redirect("/Landing")
});
app.get("/Landing", (req, res) => {
    res.render("Landing")
})
app.get("/Login", (req, res) => {
    res.render("login")
})
app.get("/Signup", (req, res) => {
    res.render("signup")
})




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));