const express = require('express');
const path = require('path');
const bodyParses = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const { get404 } = require('./controllers/errors');
const User = require('./models/user');

const PORT = 3000;
const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: 'sessions',
});

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

app.use((req, res, next) => {
  if (!req.session.user || !req.session.user._id) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

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
