const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const url = require('../config/keys').mongoURI;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load Models
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Beneficiary = require('../models/Beneficiary');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Add Beneficiary
router.get('/add', ensureAuthenticated, (req, res) => res.render('add'));

// User Dashboard
router.get('/dashboard', forwardAuthenticated, (req, res) => res.render('dashboard', {user: req.user}));

// Verify Transfer
router.post('/verify', ensureAuthenticated, (req, res) => {
  const { amount, receiver, details } = req.body;
  let errors = [];
  sender=req.user.account;

  // CHECK ERROR
  if (!amount || !details) {
    errors.push({ msg: 'Please Enter all fields' });
  } else {
    if(amount < 0) {
      errors.push({ msg: 'Cannot transfer negative values'});
    }
  }
  
  if(errors.length > 0) {
    req.flash(
      'error_msg',
      'Please Enter all details'
    );
    res.redirect('transfer');
  }  else {

        User.findOne({account: sender}, function(err, users){
            if(users.balance-amount < 0) {
                req.flash(
                  'error_msg',
                  'Not Enough Balance'
                );
                res.redirect('transfer');
            } else {

              User.findOneAndUpdate({account: receiver}, {$inc: {balance: amount}}, {useFindAndModify: false}, function(err, doc){
                if(err) console.log(err);
              });
      
              User.findOneAndUpdate({account: sender}, {$inc: {balance: -amount}}, {useFindAndModify: false}, function(err, doc){
                if(err) console.log(err);
              });
      
              const newTransaction = new Transaction({
                  sender,
                  receiver,
                  details,
                  amount
              });
      
              newTransaction
                  .save()
                  .then(transaction => {
                      req.flash(
                        'success_msg',
                        'Transaction completed'
                      );
                      res.redirect('transfer');
                    })
                    .catch(err => console.log(err));
            }
        });
  }
});

router.get('/summary', ensureAuthenticated, (req, res) => {
  sender = req.user.account;
  initial = req.user.initial;
  Transaction.find({
    $or: [
      {sender: sender}, {receiver: sender}
    ]
  }, function (err, users) {
    if(err) {
        console.log('Error Happened'  + err);
    } else {
        res.render('history', {
            users : users,
            id: req.user.account,
            initial: initial
        });
    }
  });
});

router.get('/transfer', ensureAuthenticated, (req, res) => {
  sender=req.user.account;
  Beneficiary.find({
    $and: [
      {sender: sender}, {status: true}
    ]
  }).then(users => {
    res.render('transfer', {
      users : users
    });
  });
});


// Accept Request Page
router.post('/accept', ensureAuthenticated, (req, res) => {
  receiver=req.user.account;
  const { sender } = req.body;
  Beneficiary.findOneAndUpdate({
    $and: [
      {sender: sender}, {receiver: receiver}
    ]
  }, {status: true}, {useFindAndModify: false}).then(cust => {
    req.flash(
      'success_msg',
      'Beneficiary Request Accepted'
    );
    res.redirect('requests');
  });
});

router.get('/profile', ensureAuthenticated, (req, res) => {
  account=req.user.account;
  User.find({account: account}).then(users => {
    res.render('profile', {
      users : users
    });
  });
});


// Requests Page
router.get('/requests', ensureAuthenticated, (req, res) => {
  sender=req.user.account;
  Beneficiary.find({
    $and: [
      {receiver: sender}, {status: false}
    ]
  }).then(users => {
    res.render('requests', {
      users : users
    });
  });
});

router.post('/add', ensureAuthenticated, (req, res) => {
  let errors =[];
  sender = req.user.account;
  const { receiver } = req.body;
  if(receiver == sender) {
    errors.push({ msg: 'Cannot add yourself'});
    res.render('add', {
      errors
    });
  }
  User.findOne({account: receiver}).then(user => {
    if(user) {
      Beneficiary.findOne({
        $and: [
          {sender: sender}, {receiver: receiver}
        ]
      }).then(cust => {
        if(cust) {
            if(cust.status) {
              req.flash(
                'success_msg',
                'Beneficiary Already Added'
              );
              res.render('add');
            } else {
              req.flash(
                'success_msg',
                'Request Already Sent'
              );
              res.render('add');
            }
        } else {
          status = false;
          const newBeneficiary = new Beneficiary({
            sender,
            receiver,
            status
        });

        newBeneficiary
            .save()
            .then(beneficiary => {
                req.flash(
                  'success_msg',
                  'Request Sent'
                );
                res.render('add');
              })
              .catch(err => console.log(err));
        }
      });

    } else {
      errors.push({ msg: 'Enter Valid Account No' });
      res.render('add', {
        errors
      });
    }
  });
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('user', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  account=req.user.account;
  User.findOneAndUpdate({account: account}, {last: Date()}, {useFindAndModify: false}, function(err, doc){
    if(err) console.log(err);
  });
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
