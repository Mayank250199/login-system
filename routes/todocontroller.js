var mongoose = require('mongoose');
var express = require('express');
var flash = require('connect-flash');
var expressValidator = require('express-validator');

mongoose.Promise = global.Promise;

var web = express();

//include files from models folder
var User = require('../models/user');

//Connect to the database
mongoose.connect('mongodb://<db:username>:<db:password>@ds143201.mlab.com:43201/user');
var db = mongoose.connection;

// Input data in database
  web.post('/signup', function(req,res){
  var  FirstName = req.body.FirstName;
  var  LastName  = req.body.LastName;
  var  Username  = req.body.Username;
  var  Password  = req.body.Password;
  var  ConfirmPassword = req.body.ConfirmPassword;
  var  Gender  = req.body.Gender;

  // Validation
	req.checkBody('ConfirmPassword', 'Passwords do not match').equals(req.body.Password);

  var errors = req.validationErrors();


var newUser = new User({
      FirstName : FirstName,
      LastName  : LastName,
      Username  : Username,
      Password  : Password,
      Gender    : Gender
    	});

// create users
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);

  });

  req.flash('success_msg', 'You are sign up and you can  login now');

  res.redirect('/login');


});



// authentication
web.post('/login',function(req,res){
  User.findOne( { Username:req.body.Username},function(err,user){

 if(!user)
{    req.flash('success_msg', 'Unknown User');
     res.redirect('login');
  }
  else if (user.Username == 'finalprep@gmail.com'){
      res.render('admin');
   }
  else{
  User.comparePassword(req.body.Password, user.Password, function(err, isMatch){
    if(err) throw err;
    if(isMatch){
      var name=user.FirstName;
      	res.render('userloggedin',{ name: name});

    } else {
        req.flash('error_msg', 'Invalid Password');
      res.redirect('login');
    }
  });

}

  });
  });


//logout function
web.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('login');

});

// home
web.get('/home', function(req, res){
	res.render('home');
});

web.get('/admin', function(req, res){
	res.render('admin');
});


//signup
web.get('/signup', function(req, res){
	res.render('signup');
});

web.get('/login', function(req, res){
		res.render('login');
});



module.exports = web;
