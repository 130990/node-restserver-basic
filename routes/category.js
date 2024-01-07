const { Router } = require('express');
const { body, param } = require('express-validator');
const { fieldValidator, jwtValidator, isAdminRole } = require('../middlewares');
const { getCategories, getCategoryByID, putCategory, deleteCategory, postCategory } = require('../controllers/category');
const { categoryExists } = require('../helpers/db-validators');

const router = Router();

//Get all categories - public
router.get('/', getCategories);

//Get a category - public
router.get('/:id',[
    param('id', 'It is not a valid Id').isMongoId(),
    param('id').custom(categoryExists),
], getCategoryByID);

//Add a new category - private - any person-role with a valid token
router.post('/',[
    jwtValidator,
    body('name','Name is required').not().isEmpty(),
    fieldValidator
], postCategory);

//Update a new category - private - any person-role with a valid token
router.put('/:id',[
    jwtValidator,
    body('name','Name is required').not().isEmpty(),
    param('id', 'It is not a valid Id').isMongoId(),
    param('id').custom(categoryExists),
    fieldValidator
], putCategory);

//Delete logic a new category - private - ADMIN person-role with a valid token
router.delete('/:id',[
    jwtValidator,
    isAdminRole,
    param('id', 'It is not a valid Id').isMongoId(),
    param('id').custom(categoryExists)
],deleteCategory);

module.exports =router;