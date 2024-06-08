const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email');
        return res.redirect('/login');
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.user = user;
            return req.session.save((error) => {
              console.log(error);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid password');
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'User already exists');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect('/login');
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.cookie('logout', true);
      res.redirect('/');
    }
  });
};
