const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('shop/product-list', {
      products,
      pageTitle: 'All products',
      path: '/products',
    });
  });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId).then((product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((products) => {
    res.render('shop/cart', {
      products,
      pageTitle: 'Your Cart',
      path: '/cart',
    });
  });
};

exports.postCart = async (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId).then((product) => {
    req.user.addToCart(product);
    res.redirect('/cart');
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user.deleteItemFromCart(productId).then(() => {
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    });
  });
};

exports.postOrder = (req, res, next) => {
  req.user.addOrder().then(() => {
    res.redirect('/orders');
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
