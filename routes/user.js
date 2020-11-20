const router = require('express').Router(),
    userController = require('../controllers/user-controllers'),
    auth = require('../middleware/auth');


router.post('/',userController.createUser);

router.get('/',auth,userController.getUser);

router.post('/login',userController.logIn);

router.get("/Login", (req, res) => {
    res.render("login")
})
router.get("/Signup", (req, res) => {
    res.render("signup")
})

router.get('/logout',auth,userController.logOut);
module.exports = router;