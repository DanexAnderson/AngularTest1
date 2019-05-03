const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./user.model');

// Create User
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

// User Sign in
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
        'this_is_top_secret_like_KFC_recipe',
         {expiresIn: '1h'});  // suggest the duration of the active session

      res.status(200).json({
        token: token,
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



  User.findById(req.body.userId).then(user =>{  // Check if the User Requesting Update is an Administrator
    if (user.isadmin){

  bcrypt.hash(req.body.password, 10).then(hash =>{

    const user = new User({
    _id : req.body._id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    isadmin: req.body.isadmin,
    email: req.body.email,
    password: hash
  });

    User.updateOne({_id: req.params.id }, user).then(result => {
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

  } else { res.status(401).json({message: 'You have no Admin Rights'}); }
  });

}

// Get All Users in Ascending order
exports.getUsers = (req, res) => {

   const postQuery = User.find().sort({ firstname: 1 });
   let fetchedUsers;

  postQuery.then(documents => {
     fetchedUsers = documents;
       res.status(200).json({users: fetchedUsers});
  }).catch(error =>{
   res.status(500).json({
     message: "Fetching User Failed"
   })
  })


  }

// Delete User

exports.deleteUser = (req, res) => {


  User.deleteOne({_id: req.params.id }).then(result => {

    if(result.n > 0){

      res.status(200).json({ message: "User deleted! "});
    } else {
      res.status(401).json({ message: "Not Authorized"})
    }

  }).catch(error =>{
    console.log(error);
    res.status(500).json({
      message: "Failed to Delete User"
    })
  });

}

// Get A Single User

exports.getuserOne = (req, res) => {
  User.findById(req.params.id).then(user => {
    if (user){
      res.status(200).json(user);
    }else{
      res.status(404).json({message: "User not Found !!"});
    }
  }).catch(error =>{
    res.status(500).json({
      message: "Fetching request User Failed"
    })
  })
}
