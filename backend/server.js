// get dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');



const app = express();

// parse requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
//Enable CORS for all HTTP methods
/* app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Added Authorization

    next();
  }); */

app.use(express.static(path.join(__dirname,'public'))); // create link to public folder

// Configuring the database
const config = require('./config.js');
const mongoose = require('mongoose');
require('./product.routes.js')(app);
const user = require('./user/user.routes');
app.use('/', user);

mongoose.Promise = global.Promise;

app.enable('trust proxy'); // to  enable https for req.protocol

if (process.env.NODE_ENV === 'production') {

app.use(function(req, res, next) { // force https request
  if (req.secure){
    return next();
  }
  res.redirect("https://" + req.headers.host + req.url);
});

}



// Connecting to the database
mongoose.connect(config.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname,'public', 'index.html'))  // redirect all miscellaneous request to angular
} );

// default route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Product app"});
});

// listen on port 3000
app.listen(config.serverport, () => {
    console.log("Server is listening on port 3000");
});
