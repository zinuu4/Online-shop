const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  let logoutMessage = '';
  if (req.cookies.logout) {
    logoutMessage = 'You are now logged out!';
  }
  res.clearCookie('logout');
  Product.find().then((products) => {
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      path: '/',
      logoutMessage,
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.find().then((products) => {
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
  req.user.populate('cart.items.productId').then((user) => {
    res.render('shop/cart', {
      products: user.cart.items,
      pageTitle: 'Your Cart',
      path: '/cart',
    });
  });
};

exports.postCart = async (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId).then((product) => {
    req.user.addToCart(product).then(() => {
      res.redirect('/cart');
    });
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user.removeFromCart(productId).then(() => {
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id }).then((orders) => {
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
  });
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
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
