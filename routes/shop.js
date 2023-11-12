const express = require('express');

const { products } = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('shop', { products, documentTitle: 'Shop', path: '/' });
});

module.exports = router;
