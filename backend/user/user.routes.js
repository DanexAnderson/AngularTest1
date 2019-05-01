const express = require('express');
const router = express.Router();


const UserController = require('./user.controller');
const checkAuth = require('./auth-check');

router.post('/createuser', UserController.createUser);


router.post('/signin', UserController.userSignin);

router.put('/updateuser/:id',checkAuth , UserController.updateUser);




module.exports = router;
