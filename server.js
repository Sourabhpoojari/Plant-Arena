const express = require('express'),
    app = express(),
    connectDB = require('./config/db');

// DB connection
connectDB();

// middleware
app.set('view engine','ejs');

    






const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));