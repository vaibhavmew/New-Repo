const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load Models
const Admin = require('../models/Admin');
const User = require('../models/User');

module.exports = function(passport) {
  passport.use('user', new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({
      email: email
    }).then(user => {
      if (!user) {
        return done(null, false, { message: 'That email is not registered' });
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    });
  })
  );

  passport.use('admin', new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    Admin.findOne({
      email: email
    }).then(user => {
      if (!user) {
        return done(null, false, { message: 'That email is not registered' });
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    });
  })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      if(err) done(err);
        if(user){
          done(null, user);
        } else {
           Admin.findById(id, function(err, user){
           if(err) done(err);
           done(null, user);
        })
    }
 });

});

};
