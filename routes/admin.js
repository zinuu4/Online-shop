const express = require('express');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    documentTitle: 'Add product',
    path: '/admin/add-product',
  });
});

router.post('/add-product', (req, res, next) => {
  const body = req.body;
  products.push({ title: body.title });
  res.redirect('/');
});

exports.routes = router;
exports.products = products;
