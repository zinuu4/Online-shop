const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session?.user,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('65996846d5662e476cf8f82a')
    .then((user) => {
      req.session.user = user;

      req.session.save((error) => {
        console.log(error);
        res.redirect('/');
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/');
    }
  });
};
