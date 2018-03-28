const mongoose = require('mongoose');

// Doc for Mongoose Schemas: http://mongoosejs.com/docs/guide
const Schema = mongoose.Schema;


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


// Doc for Mongoose Connections: http://mongoosejs.com/docs/connections
mongoose.connect('mongodb://user1:news-it123@ds117469.mlab.com:17469/news-it', (error) => {
  if (error) console.log(error);

  console.log('Database connection successful');

});

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

// Use the schema to create a model
module.exports = mongoose.model('User', userSchema);

/*
savedTopics: [{
		type: String
		}]*/