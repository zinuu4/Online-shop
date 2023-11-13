const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      products,
      documentTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      products,
      documentTitle: 'All products',
      path: '/products',
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    documentTitle: 'Your Cart',
    path: '/cart',
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    documentTitle: 'Your orders',
    path: '/orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    documentTitle: 'Checkout',
    path: '/checkout',
  });
};
