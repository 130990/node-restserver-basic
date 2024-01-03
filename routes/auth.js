const { Router } = require('express');
const { body, param } = require('express-validator');
const { login } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');

const router = Router();

router.post('/login',[
    body('email', 'Email is required').isEmail(),
    body('password', 'Password is required').not().isEmpty(),
    fieldValidator
], login );

module.exports =router;