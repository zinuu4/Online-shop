const express = require('express');

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require('../controllers/admin');
const { isAuth } = require('../middleware/is-auth');
const {
  editProductValidators,
} = require('../middleware/validators/admin-product');

const router = express.Router();

router.get('/add-product', isAuth, getAddProduct);
router.post('/add-product', ...editProductValidators, isAuth, postAddProduct);

router.get('/products', isAuth, getProducts);

router.get('/edit-product/:productId', isAuth, getEditProduct);
router.post('/edit-product', ...editProductValidators, isAuth, postEditProduct);

router.post('/delete-product/:id', isAuth, postDeleteProduct);

module.exports = router;
