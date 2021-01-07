const router = require('express').Router(),
    userController = require('../controllers/user-controllers'),
    { isLoggedIn } = require('../middleware/auth'),
    { check } = require('express-validator');


router.post('/',
    check('name', 'name is required!').not().isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'password must contain atleast 6 characters').isLength({ min: 6 }),
    check('phone', 'please enter a valid phone number').isLength({ min: 10 }),
    userController.createUser);

router.get('/', isLoggedIn, userController.getUser);

router.post('/login',
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'password is required').exists(),
    userController.logIn);

router.get("/Login", (req, res) => {
    res.render("login")
})
router.get("/Signup", (req, res) => {
    res.render("signup")
})

router.get('/logout', isLoggedIn, userController.logOut);
module.exports = router;