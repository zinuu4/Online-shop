const express = require('express');
const path = require('path');
const bodyParses = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/errors');
const User = require('./models/user');

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParses.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('65996846d5662e476cf8f82a')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
      next();
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

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
