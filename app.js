const express = require('express');
const path = require('path');
const bodyParses = require('body-parser');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/errors');
const { mongoConnect } = require('./utils/database');

const PORT = 5001;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParses.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoConnect(() => {
  app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
});
