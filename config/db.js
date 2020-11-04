const mongoose = require('mongoose'),
    config = require('config'),
    db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useUnifiedTopology : true,
            useCreateIndex: true,
            useFindAndModify:false
        });
        console.log('db connected...');
    } catch (err) {
        console.error(err.message);
        // kill connection
        process.exit(1);
    }
};

module.exports = connectDB;