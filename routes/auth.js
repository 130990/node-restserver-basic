const { Router } = require('express');
const { body, param } = require('express-validator');
const { login, googleSignIn, validateToken } = require('../controllers/auth');
const { fieldValidator, jwtValidator } = require('../middlewares');

const router = Router();

router.post('/login',[
    body('email', 'Email is required').isEmail(),
    body('password', 'Password is required').not().isEmpty(),
    fieldValidator
], login );

router.post('/google',[
    body('id_token', 'id_token is required').not().isEmpty(),
    googleSignIn
], login );

router.get('/', jwtValidator, validateToken)

module.exports =router;