const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

const User = require('./public/js/user')

var bodyParser = require('body-parser');


app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index'));
//app.get('/', (req, res) => res.sendFile('index.html', {root : __dirname + '/'}));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.post('/signup', function (req, res) {
/*
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    return next(err);
  }
*/
	console.log("...");
	console.log(req.body);
	if (req.body.fullname &&
	  	req.body.email &&
	    req.body.username &&
	    req.body.password) {
		var topics = new Array();
	    var userData = {
	      fullname: req.body.fullname,
	      email: req.body.email,
	      username: req.body.username,
	      password: req.body.password,
	      savedTopics: topics
	    }
	}
	//console.log
    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
      	console.log("error");
      	return res.redirect('/');
      } else {
      	console.log("no error")
        return res.redirect('/');			//change this
      }
    });

  /*} else {
    var err = new Error('All fields have to be filled out');
    err.status = 400;
    return next(err);
  }*/

});

app.post('/login', function (req, res) {
  console.log('findOne');
      User.findOne({ username: req.body.username, password: req.body.password }, (err, aUser) => {
      if (err) {
        console.log("error!!");
        return res.redirect('/');
      } else {
        if (aUser != null) {
          console.log(aUser);
          return res.redirect('/'); 
        } {
          return res.redirect('/'); 
        }  //change this
      }
    });
});

// POST route after registering
app.post('/profile', function (req, res, next) {
  return res.send('POST profile');
});