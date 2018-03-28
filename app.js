const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

const User = require(__dirname +'/src/models/user');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index'));

// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(expressValidator()); // This line must be immediately after express.bodyParser()!

const users = require(__dirname +'/src/routes/user-routes');


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


//POST route for updating data
app.post('/register', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password ) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.redirect('/');
      }
    });
    
    }

});