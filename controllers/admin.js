const { validationResult } = require('express-validator');

const Product = require('../models/product');
const { return500Error } = require('../utils/error-500');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: '',
    errorMessage: '',
    product: { title: '', imageUrl: '', description: '', price: '' },
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      editing: '',
      errorMessage: errors.array()[0].msg,
      product: { title, imageUrl, description, price },
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId: req.user,
  });
  product
    .save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => return500Error(err, next));
};

exports.getEditProduct = (req, res, next) => {
  const { editMode } = req.query;
  const { productId } = req.params;
  if (!editMode) {
    return res.redirect('/');
  }

  Product.findById(productId).then((product) => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }

    res.render('admin/edit-product', {
      product,
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
      errorMessage: '',
      validationErrors: [],
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, _id } = req.body;
  const { editMode } = req.query;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
      errorMessage: errors.array()[0].msg,
      product: { title, imageUrl, description, price, _id },
      validationErrors: errors.array(),
    });
  }

  Product.findById(_id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save().then(() => {
        res.redirect('/admin/products');
      });
    })
    .catch((err) => return500Error(err, next));
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.params;
  Product.deleteOne({ _id: id, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => return500Error(err, next));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'username')
    .then((products) => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin products',
        path: '/admin/products',
      });
    })
    .catch((err) => return500Error(err, next));
};
