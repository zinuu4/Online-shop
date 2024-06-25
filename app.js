const express = require('express');
const path = require('path');
const bodyParses = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const { get404, get500 } = require('./controllers/errors');
const User = require('./models/user');

const PORT = 3000;
const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'sessions',
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParses.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrfProtection);
app.use(flash());
app.use(cookieParser());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((error) => {
      next(new Error(error));
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session?.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', get500);

app.use(get404);

app.use((error, req, res, next) => {
  res.redirect('/500');
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server started - http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.log(error);
  });
