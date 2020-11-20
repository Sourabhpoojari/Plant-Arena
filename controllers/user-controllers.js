const User = require('../models/user'),
    gravatar = require('gravatar'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    express = require('express'),
    app = express(),
    config = require('config');
const Swal = require('sweetalert2')
// @route POST /user
// @desc register user
// @access Public
const createUser = async (req, res, next) => {
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
            password,
            phone,
            avatar
        });
        // bcrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // token
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;

                user.token = token;
                user.save();

                req.flash("success", "Signup Successful");
                res.render('Landing', { user: user });

                res.status(200).json({ token });
            }
        );

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
        const user = await User.findById(req.user.id).select('-password -token');
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
        // setting jwt
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                // use this token to login

                console.log("login success");
                user.token = token;
                user.save();
                req.flash("success", "successfully Logged in");

                res.render('Landing', { user: user });


                res.status(200).json({ token });
            }
        );
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
        user.token = null;
        await user.save();
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