// Creator:  Dane Anderson
// Location: Kingston, Jamaica

const express = require('express');
const router = express.Router();


const UserController = require('./user.controller');
const checkAuth = require('./auth-check');

// Create User
router.post('/createuser',  checkAuth, UserController.createUser);

// User Sign-In
router.post('/signin',   UserController.userSignin); //

// Update User
router.put('/updateuser/:id', checkAuth, UserController.updateUser);

// Get All Users
router.get('/getusers', checkAuth, UserController.getUsers);

// Delete A User by ID
router.delete('/deleteuser/:id', checkAuth, UserController.deleteUser);

// Get a Single User by ID
router.get('/getuserone/:id', checkAuth, UserController.getuserOne);


module.exports = router;
