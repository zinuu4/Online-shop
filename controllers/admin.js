const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: '',
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;

  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId: req.user._id,
  });
  product.save().then(() => {
    res.redirect('/admin/products');
  });
};

exports.getEditProduct = (req, res, next) => {
  const { editMode } = req.query;
  const { productId } = req.params;
  if (!editMode) {
    return res.redirect('/');
  }
  Product.findById(productId).then((product) => {
    res.render('admin/edit-product', {
      product,
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, _id } = req.body;

  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    id: _id,
  });

  product.save().then(() => {
    res.redirect('/admin/products');
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.params;
  Product.deleteById(id).then(() => {
    res.redirect('/admin/products');
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('admin/products', {
      products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    });
  });
};
