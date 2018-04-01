const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const User = require('./public/js/user')
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync();


app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.get('/', (req, res) => res.render('index'));
//app.get('/', (req, res) => res.sendFile('index.html', {root : __dirname + '/'}));


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(cookieParser());
session.nCookieExpirationDelay = 48;
session.bLocationLogin = true; //keep this for testing purposes only- shows username in url

app.use(session({
   key: 'user_sessionid',	
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sessionid');        
    }
    next();
});

var checkSession = (req, res, next) => {
    if (req.session.user && req.cookies.user_sessionid) {
        res.redirect('/');
    } else {
        next();
    }    
};


// route for handling 404 requests(unavailable routes)
//app.use(function (req, res, next) {
//  res.status(404).send("Oops! Cannot find whst you're looking for!")
//});



app.get('/',  function (req, res) {
	if (req.session.userInfo && req.cookies.user_sessionid) {	
	  res.render('login', {
      savedTopics: req.session.userInfo.savedTopics, 
			fullname:req.session.userInfo.fullname, 
			email: req.session.userInfo.email, 
			username: req.session.userInfo.username,
			password:  req.session.userInfo.password
    });
	}
	else {
		res.render('index', {savedTopics: [], fullname: "", email: "", username: "", password: ""});
	}
});

app.post('/topic', function (req, res) {
  if (req.body.topic && req.session.userInfo.username) {
    User.findOne({ username: req.session.userInfo.username }, (err, aUser) => {
      if (err) {
        console.log("error!!");
        return res.redirect('/');
      }
      if (aUser != null) {
        if(aUser.savedTopics.length == aUser.savedTopics.filter(function(topic) { return topic != req.body.topic }).length) {
          aUser.savedTopics.push(req.body.topic);
          aUser.save((err1) => {
            if (err1) {
              console.log("save error!!");
              res.redirect('/');
            } else {
              res.render('login', {
                savedTopics: aUser.savedTopics, 
                fullname: req.session.userInfo.fullname, 
                email: req.session.userInfo.email, 
                username: req.session.userInfo.username,
                password:  req.session.userInfo.password
              });
              console.log("saved");
            }
          });
        } else {
          res.redirect('/');
          console.log("already exists");
        }
      } else {
        res.redirect('/');
        console.log("No such user found");
      }
    });
  } else {
    console.log("not logged in");
    res.redirect('/');
  }
});

app.get('/topic', function (req, res) {
  if (req.query.topic && req.session.userInfo.username) {
    User.findOne({ username: req.session.userInfo.username }, (err, aUser) => {
      if (err) {
        console.log("error!!");
        return res.redirect('/');
      }
      if (aUser != null) {
        aUser.savedTopics = aUser.savedTopics.filter(function(topic) { return topic != req.query.topic });
        aUser.save((err1) => {
          if (err1) {
            console.log("delete error!!");
            res.redirect('/');
          } else {
            res.redirect('/');
            console.log("delete");
          }
        });
      } else {
        res.redirect('/');
        console.log("No such user found");
      }
    });
  } else {
    console.log("no topic selected");
    res.redirect('/');
  }
});

app.post('/signup', function (req, res) {

	console.log("...");
	console.log(req.body);
	if (req.body.fullname &&
	  	req.body.email &&
	    req.body.username &&
	    req.body.password) {
		var topics = new Array();
		var hash = bcrypt.hashSync(req.body.password, salt);
	    var userData = {
	      fullname: req.body.fullname,
	      email: req.body.email,
	      username: req.body.username,
	      password: hash,
	      savedTopics: []
	    }
	    console.log("userData is:");
	    console.log(userData);
	}
	//console.log
    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
      	console.log("error");
      	return res.redirect('/');
      } else {
      	console.log("no error");
      	//req.session.user = userData.email;
      }
    });
});

app.post('/login', function (req, res) {
  console.log('findOne');
  if (req.body.username && req.body.password) {  	
    User.findOne({ username: req.body.username}, (err, aUser) => {
      if (err) {
        console.log("error!!");
        return res.redirect('/login');
      } else {
        if (aUser != null) {
          console.log(aUser);
          if(bcrypt.compareSync(req.body.password, aUser.password)){
          	req.session.userInfo = aUser; //unique session identifier 
           	console.log("req.session:");
			      console.log(req.session);
         	  console.log("req.session.user:");
			      console.log(req.session.userInfo);
          	res.render('login', aUser);
          }
          else{
          	console.log("Incorrect Password");
          	return false;
          }
        } else {
          console.log("No such user found");
          return false;
        }  //change this
      }
    });
  } else {
    console.log("No info entered");
    return res.redirect('/');
  }
});

 	
app.get('/logout', function (req, res) {
   if (req.session.userInfo && req.cookies.user_sessionid) {
   		console.log("clearing");
        res.clearCookie('user_sessionid');
        res.redirect('/');
    } else {
        res.redirect('/');
    }

});
  
