const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./user.model');

exports.createUser = (req, res)=>{

  bcrypt.hash(req.body.password, 10).then(hash =>{

    const user = new User({
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    email: req.body.email,
    isadmin: req.body.isadmin,
    password: hash
  });

    user.save().then(result => {
      res.status(201).json({
        message: 'New User Created !',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        message: "Invalid Email Authentication Credentials"  // Response Error Message for error-interceptor
      });
    });
  });

}

exports.userSignin = (req, res, next) => {

  let fetchedUser;


  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed, invalid user"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {

    if (!result){

      return res.status(401).json({
        message: "Auth Failed not Password"
      });
    }
      const token = jwt.sign({        // JWTwebToken to encrypt tokens sent to the client
        email: fetchedUser.email, userId: fetchedUser._id },
         'secret_this_should_be_longer',
         {expiresIn: '1h'});  // suggest the duration of the active session

      res.status(200).json({
        jwt: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        firstName: fetchedUser.firstname,
        isadmin: fetchedUser.isadmin
      });

  }).catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "Authentication Failed. Altered Credentials"
    });
  })
}

// Update User Info

exports.updateUser = (req, res)=>{

  bcrypt.hash(req.body.password, 10).then(hash =>{

    const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    isadmin: req.body.isadmin,
    email: req.body.email,
    password: hash
  });

    User.updateOne({_id: req.params._id, isadmin: true }, user).then(result => {
      res.status(201).json({
        message: 'User Successfully Updated !',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        message: "Invalid Credentials"  // Response Error Message for error-interceptor
      });
    });
  });

}
