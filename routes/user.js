const router = require('express').Router(),
    userController = require('../controllers/user-controllers'),
    auth = require('../middleware/auth');


router.post('/',userController.createUser);

router.get('/',auth,userController.getUser);

router.post('/login',userController.logIn);


module.exports = router;