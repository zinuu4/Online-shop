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
    userId: req.user,
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

  Product.findByIdAndUpdate(_id, { title, imageUrl, price, description }).then(
    () => {
      res.redirect('/admin/products');
    }
  );
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.params;
  Product.findByIdAndDelete(id).then(() => {
    res.redirect('/admin/products');
  });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'username')
    .then((products) => {
      console.log(products);
      res.render('admin/products', {
        products,
        pageTitle: 'Admin products',
        path: '/admin/products',
      });
    });
};
