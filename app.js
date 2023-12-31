const express = require('express');
const path = require('path');
const bodyParses = require('body-parser');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/errors');
const { mongoConnect } = require('./utils/database');
const User = require('./models/user');

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParses.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6579b2a3fd0442d48a7d2b69')
    .then((user) => {
      req.user = new User({
        username: user.username,
        email: user.email,
        cart: user.cart,
        id: user._id,
      });
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

mongoConnect(() => {
  app.listen(PORT, () =>
    console.log(`Server started - http://localhost:${PORT}`)
  );
});
