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
  });
  product.save();

  res.redirect('/admin/add-product');
};

exports.getEditProduct = (req, res, next) => {
  const { editMode } = req.query;
  const { productId } = req.params;
  if (!editMode) {
    return res.redirect('/');
  }
  Product.findById(productId, (product) => {
    res.render('admin/edit-product', {
      product,
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, id } = req.body;
  const updatedProduct = { title, imageUrl, price, description, id };
  Product.updateProduct(updatedProduct);
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.params;
  Product.deleteProduct(id);
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    });
  });
};
