const User = require('../models/user'),
    gravatar = require('gravatar'),
    bcrypt = require('bcryptjs'),
    Token = require('../config/token'),
    config = require('config'),
    passport = require('passport'),
    { validationResult } = require('express-validator');
const Swal = require('sweetalert2');


// @route POST /user
// @desc register user
// @access Public
const createUser = async (req, res, next) => {
    const { name, email, password, phone } = req.body;
    let errors = [];

    if (!name || !email || !password || !phone) {
        errors.push({ msg: 'Please enter all fields' });
    }



    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            phone,
            password

        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('singup', {
                    errors,
                    name,
                    email,
                    phone,
                    password

                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    phone,
                    password
                });
                console.log(newUser);

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash("success", "signup successful welcome to plantarena " + user.name);
                                console.log("user registered successfully");
                                res.redirect('/Landing');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
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
        return res.status(400).json({ errors: errors.array() });
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


        await passport.authenticate('local',
            {

                successRedirect: '/Landing',
                failureRedirect: '/Login'

            },
            (req, res) => {

                return res.status(201).json({ user });

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