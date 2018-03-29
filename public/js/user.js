var mongoose = require('mongoose');
//var bcrypt = require('bcrypt');
//var express = require('express');
//var app = express();
//var bodyParser = require('body-parser');

//connect to MongoDB
mongoose.connect('mongodb://user1:news-it123@ds117469.mlab.com:17469/news-it');
var db = mongoose.connection;


//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("connected!!");
});

var userSchema = new mongoose.Schema({
	fullname: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,		
		required: true,
		unique: true,
		trim: true
	},
	username: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	}
	
});

module.exports = mongoose.model('User', userSchema);

/*
//hashing a password before saving it to the database
Users.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

*/

// var User = mongoose.model('User', Users);
// module.exports = User;
// var express = require('express');
// var router = express.Router();


// //POST route for updating data
// router.post('/', function (req, res, next) {
// /*
//   // confirm that user typed same password twice
//   if (req.body.password !== req.body.passwordConf) {
//     var err = new Error('Passwords do not match.');
//     err.status = 400;
//     return next(err);
//   }
// */
//   if (req.body.fullname &&
//   	req.body.email &&
//     req.body.username &&
//     req.body.password) {

//     var userData = {
//       fullname: req.body.fullname,
//       email: req.body.email,
//       username: req.body.username,
//       password: req.body.password,
//     }

//     //use schema.create to insert data into the db
//     User.create(userData, function (err, user) {
//       if (err) {
//         return next(err)
//       } else {
//         return res.redirect('/profile');
//       }
//     });

//   } else {
//     var err = new Error('All fields have to be filled out');
//     err.status = 400;
//     return next(err);
//   }

// });

// // POST route after registering
// router.post('/profile', function (req, res, next) {
//   return res.send('POST profile');
// });