const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const { return500Error } = require('../utils/error-500');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message.length > 0 ? message[0] : null,
    oldInput: { email: '', password: '' },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message.length > 0 ? message[0] : null,
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

  const errorPageRender = (message) => {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: message,
      oldInput: { email, password },
      validationErrors: [],
    });
  };

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return errorPageRender("User doesn't exist");
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.user = user;
      return req.session.save((error) => {
        if (error) {
          console.log(error);
        }
        res.redirect('/');
      });
    } else {
      return errorPageRender('Invalid password');
    }
  } catch (err) {
    return500Error(err, next);
  }
};

exports.postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await user.save();

    res.redirect('/login');

    await transporter.sendMail({
      to: email,
      from: process.env.GMAIL_USER,
      subject: 'Signup succeeded',
      html: `
        <h1>You successfully signed up</h1>
        <img src="cid:unique@nodemailer.com"/>
      `,
      attachments: [
        {
          filename: 'image.jpg',
          path: 'https://avatars.githubusercontent.com/u/127029646?s=400&u=e7553c31214bb27a5ff257807212036cf815b06d&v=4',
          cid: 'unique@nodemailer.com',
        },
      ],
    });
  } catch (err) {
    return500Error(err, next);
  }
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

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with that email found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect('/');
        transporter.sendMail({
          to: email,
          from: process.env.GMAIL_USER,
          subject: 'Reset password link',
          html: `
            <p>You requested password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
          `,
        });
      })
      .catch((err) => return500Error(err, next));
  });
};

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params;
  // $gt - greater than
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash('error');
      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        errorMessage: message.length > 0 ? message[0] : null,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => return500Error(err, next));
};

exports.postNewPassword = (req, res, next) => {
  const { newPassword, userId, passwordToken } = req.body;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => return500Error(err, next));
};
