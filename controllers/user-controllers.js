const User = require('../models/user'),
    gravatar = require('gravatar'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    config = require('config');

const createUser = async (req,res,next) => {
    const { name, email, password, phone} = req.body;
    let user;
    try {
        user = await User.findOne({email});
        if (user) {
            return res.status(400).json({errors:[{msg : "User with this email'id already exists"}]});
        }
        const avatar = gravatar.url(email,{
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        user = new User({
            name,
            email,
            password,
            phone,
            avatar
        });
        // bcrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();

        // token
        const payload = {
            user : {
                id : user.id
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn : 3600},
            (err,token)=>{
                if (err) throw err;
                res.status(200).json({token});
            }
        );

    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

exports.createUser = createUser;