const User = require('../models/user'),
    gravatar = require('gravatar'),
    bcrypt = require('bcryptjs'),
    passport = require('passport'),
    {validationResult} = require('express-validator');
const Swal = require('sweetalert2');


// @route POST /user
// @desc register user
// @access Public
const createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // use flash to display errors
        return res.status(400).json({errors:errors.array()});
    }
    const { name, email, password, phone } = req.body;
    let user;
    try {
        user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User with this email'id already exists" }] });
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        user = new User({
            name,
            email,
            phone,
            avatar
        });
        User.register(name,password,(err,user)=>{
            if (err) {
                return res.redirect('Signup');
            }
            passport.authenticate('local')(req,res,()=>{
                // use redirect here with flash
                res.redirect("/Landing");
                
            });
        });

       
        // return res.status(200).send("user registered");
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

// @route GET /user
// @desc get user details
// @access Private
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(201).json({ user });
        // give 
    } catch (err) {
        console.log(err);
        res.status(500).send("cannot get user!");
    }
};

// @route POST /login
// @desc login user
// @access Public
const logIn = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
    const { email, password } = req.body;
    let user;
    try {
        user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
        }
        // check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
        }
        // admin login
        if (user.isAdmin) {
            
        } else {
            
        }
        await passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect:'/login'
        },
        (req,res)=>{
            console.log(user);
            return res.status(201).json({user});
        });
       
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}

// @route GET /logout
// @desc login user
// @access Private
const logOut = async (req, res, next) => {
    // remove token from user
    try {
        const user = await User.findById(req.user.id).select('-password');
        req.logout();
        // res.redirect('/Landing');
        res.status(200).send('user logged out');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
}


exports.createUser = createUser;
exports.getUser = getUser;
exports.logIn = logIn;
exports.logOut = logOut;