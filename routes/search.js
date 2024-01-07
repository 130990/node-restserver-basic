const { Router } = require('express');
const { body, param } = require('express-validator');
const { fieldValidator, jwtValidator, isAdminRole } = require('../middlewares');
const { search } = require('../controllers/search');
const { productExists } = require('../helpers/db-validators');

const router = Router();

//Get generic search
router.get('/:collection/:searchValue', search);

module.exports =router;