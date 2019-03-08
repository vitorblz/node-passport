const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const validatePassword = (pass1, pass2) => new Promise((resolve) => {
  bcrypt.compare(pass1, pass2, (err, isMatch) => {
    if (err) throw err;

    resolve(isMatch);
  });
});

module.exports = (passport) => {
  passport.use(new LocalStrategy({ usernameField: 'email' },
    (username, password, done) => {
      User.findOne({ email: username }).then(async (user) => {
        if (!user) return done(null, false, { message: 'Incorrect username.' });

        const isValid = await validatePassword(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      }).catch(err => done(err));
    }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
