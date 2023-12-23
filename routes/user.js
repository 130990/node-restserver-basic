const { Router } = require('express');
const { body, param } = require('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { isValidRole, emailExists, userExists } = require('../helpers/db-validators');
const { getUsers,
    postUsers,
    putUsers,
    deleteUsers } = require('../controllers/user');

const router = Router();

router.get('/', getUsers);
router.post('/', [
    body('name', 'Name is required').notEmpty(),
    body('password', 'Password must contain more tha 6 characters').isLength({ min: 6 }),
    body('email', 'Format of email is not valid').isEmail(),
    body('email').custom(emailExists),
    body('role').custom(isValidRole),
    fieldValidator],
    postUsers);
router.put('/:id', [
    param('id', 'It is not a valid Id').isMongoId(),
    param('id').custom(userExists),
    fieldValidator
], putUsers);
router.delete('/:id', [
    param('id', 'It is not a valid Id').isMongoId(),
    param('id').custom(userExists),
    fieldValidator
], deleteUsers);


module.exports = router;