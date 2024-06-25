const Product = require('../models/product');
const Order = require('../models/order');
const { return500Error } = require('../utils/error-500');

exports.getIndex = (req, res, next) => {
  let logoutMessage = '';
  if (req.cookies.logout) {
    logoutMessage = 'You are now logged out!';
  }
  res.clearCookie('logout');
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
        logoutMessage,
      });
    })
    .catch((err) => return500Error(err, next));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All products',
        path: '/products',
      });
    })
    .catch((err) => return500Error(err, next));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => return500Error(err, next));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      res.render('shop/cart', {
        products: user.cart.items,
        pageTitle: 'Your Cart',
        path: '/cart',
      });
    })
    .catch((err) => return500Error(err, next));
};

exports.postCart = async (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      req.user.addToCart(product).then(() => {
        res.redirect('/cart');
      });
    })
    .catch((err) => return500Error(err, next));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .removeFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => return500Error(err, next));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      let total = 0;
      orders.forEach((order) => {
        order.products.forEach((p) => {
          total += p.product.price * p.quantity;
        });
      });
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
        total,
      });
    })
    .catch((err) => return500Error(err, next));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });

      const order = new Order({
        user: {
          userId: req.user,
          email: req.user.email,
        },
        products,
      });

      order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => return500Error(err, next));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
