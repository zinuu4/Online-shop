const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    documentTitle: 'Add product',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res, next) => {
  const { body } = req;

  const product = new Product({ title: body.title });
  product.save();

  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      products,
      documentTitle: 'Admin products',
      path: '/admin/products',
    });
  });
};