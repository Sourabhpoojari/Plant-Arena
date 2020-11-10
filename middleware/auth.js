const jwt = require('jsonwebtoken'),
    config = require('config');

module.exports = (req,res,next)=>{
    const token = req.header('x-auth-token');
    // if no token
    if(!token){
        return res.status(401).json({msg:'No token found, authorization denied'});
    }
    // verify token 
    try {
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg:'Token is not valid'});
    }
};