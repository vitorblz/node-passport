const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
    done(null, user.email);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ email: id }).then(async (user) => {
      if (!user) return done(null, false, { message: 'Incorrect username.' });

      return done(null, user);
    }).catch(err => done(err));
  });

  // Use google strategy
  passport.use(new GoogleStrategy({
    clientID: '662234176965-35arvt4oieekeee4q9vn46kklr7ii63d.apps.googleusercontent.com',
    clientSecret: 'PlC6BSE9zqul-nHH0ttS9rK0',
    callbackURL: '/users/login/google/redirect',
  }, (request, accessToken, refreshToken, profile, done) => {
    done(null, { email: profile.emails[0].value });
  }));
};
