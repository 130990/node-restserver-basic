const { Router } = require('express');
const { body, param } = require('express-validator');
const { fieldValidator, jwtValidator, isAdminRole } = require('../middlewares');
const { getProducts, getProductByID, putProduct, deleteProduct, postProduct } = require('../controllers/product');
const { productExists } = require('../helpers/db-validators');

const router = Router();

//Get all product - public
router.get('/', getProducts);

//Get a product - public
router.get('/:id',[
    param('id', 'It is not a valid Id').isMongoId(),
    param('id').custom(productExists),
], getProductByID);

//Add a new product - private - any person-role with a valid token
router.post('/',[
    jwtValidator,
    body('name','Name is required').not().isEmpty(),
    fieldValidator
], postProduct);

//Update a new product - private - any person-role with a valid token
router.put('/:id',[
    jwtValidator,
    body('name','Name is required').not().isEmpty(),
    param('id', 'It is not a valid Id').isMongoId(),
    param('id').custom(productExists),
    fieldValidator
], putProduct);

//Delete logic a new product - private - ADMIN person-role with a valid token
router.delete('/:id',[
    jwtValidator,
    isAdminRole,
    param('id', 'It is not a valid Id').isMongoId(),
    param('id').custom(productExists)
],deleteProduct);

module.exports =router;