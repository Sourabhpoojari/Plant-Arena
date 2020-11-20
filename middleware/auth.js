const jwt = require('jsonwebtoken'),
    config = require('config'),
    User = require('../models/user');

module.exports = async (req,res,next)=>{
    const token = req.header('x-auth-token');
    // if no token
    // if (!token) {
    //     return res.status(401).json({ msg: 'No token found, authorization denied' });
    // }
    // verify token 
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        const user = await User.findById(req.user.id).select('-password');
        if (user.token == null || !token) {
            return res.status(401).json({msg:'No token found, authorization denied'});
        }
        next();
    } catch (err) {
        console.log(err.message);
        res.status(401).json({msg:'Token is not valid'});
    }
};