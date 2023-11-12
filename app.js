const express = require('express');
const path = require('path');
const bodyParses = require('body-parser');

const { routes: adminRoutes } = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const PORT = 5001;
const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParses.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res
    .status(404)
    .render('404', { documentTitle: '404 Page', title: 'Page Not Found!' });
});

app.listen(PORT);
