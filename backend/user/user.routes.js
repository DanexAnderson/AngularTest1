const express = require('express');
const router = express.Router();


const UserController = require('./user.controller');
const checkAuth = require('./auth-check');

router.post('/createuser', UserController.createUser);


router.post('/signin',   UserController.userSignin); //

router.put('/updateuser/:id', UserController.updateUser);

router.get('/getusers', checkAuth, UserController.getUsers);

router.delete('/deleteuser/:id', UserController.deleteUser);

router.get('/getuserone/:id', UserController.getuserOne);


module.exports = router;
