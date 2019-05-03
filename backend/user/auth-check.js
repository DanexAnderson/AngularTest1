// Creator:  Dane Anderson
// Location: Kingston, Jamaica

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
  const token = req.headers.authorization.split(" ")[1]; // Extract Authorization Token from Header
   const decodedToken = jwt.verify(token, 'this_is_top_secret_like_KFC_recipe'); // decrypt header token and check if it matches server
  req.userData = { email: decodedToken.email, userId: decodedToken.userId };
  next(); // continue Authentication if header token and Server token matches
  } catch(error){
    res.status(401).json({ message: "Auth user Invalid"});
  }

};

// Check if the http request sent is a valid authentication.
// decrypt http Token sent by the frontend.
