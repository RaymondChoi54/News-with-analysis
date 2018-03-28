const User = require('../models/user');


exports.addOne = function addUser(req, res) {
  console.log('Add User');
  console.log(req.body);
  const newUser = new User(req.body);
  newUser.save((err) => {
    if (err) throw err;

    res.redirect('/');
  });

}