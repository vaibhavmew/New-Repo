const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load Models
const Admin = require('../models/Admin');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { forwardAdminAuthenticated, ensureAdminAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAdminAuthenticated, (req, res) => res.render('adminlogin'));

router.get('/dash', forwardAdminAuthenticated, (req, res) => res.render('admindashboard'));

// Register Page
router.get('/register', ensureAdminAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', ensureAdminAuthenticated, (req, res) => {
  const { name, email, password, balance, account } = req.body;
  let errors = [];

  if (!name || !email || !password || !balance || !account) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      balance,
      account
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          balance,
          account
        });
      } else {
        sender=0;
        receiver=account;
        amount=balance;
        const newTransaction = new Transaction({
          details: 'Opening Balance',
          sender,
          receiver,
          amount
        });

        newTransaction
            .save()
            .then()
            .catch(err => console.log(err));

        initial = balance;
        const newUser = new User({
          name,
          email,
          password,
          balance,
          account,
          initial
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'New User Registered'
                );
                res.redirect('register');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('admin', {
    successRedirect: '/dash',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admin/login');
});

module.exports = router;
