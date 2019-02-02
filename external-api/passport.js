const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('@db/models/User')

const localStrategy = (email, password, done) => {
  User.findOne({ email }, (findErr, user) => {
    if (!user) return done(null, false, { message: `There is no record of the email ${email}.` });
    return user.comparePassword(password, (passErr, isMatch) => {
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { message: 'Your email or password combination is not correct.' });
    });
  });
};

const initPassport = (router) => {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, localStrategy));

  router.use(passport.initialize())
  router.use(passport.session())
}

module.exports = initPassport
