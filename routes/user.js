const router = require('express').Router(),
    userController = require('../controllers/user-controllers');


    router.post('/',userController.createUser);




    module.exports = router;