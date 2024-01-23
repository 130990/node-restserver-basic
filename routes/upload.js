const { Router } = require('express');
const { body, param } = require('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { uploadFiles, imageUpdate,imageUpdateCloudinary, displayImage } = require('../controllers/upload');
const { validCollections } = require('../helpers');
const { fileUploadValidator } = require('../middlewares');

const router = Router();

router.post('/',[
    fileUploadValidator
], uploadFiles);

router.put('/:collection/:id',[
    param('id', 'It is not a valid Id').isMongoId(),
    param('collection').custom( c => validCollections(c, ['users', 'products'])),
    fieldValidator,
    fileUploadValidator
], imageUpdateCloudinary);

router.get('/:collection/:id',[
    param('id', 'It is not a valid Id').isMongoId(),
    param('collection').custom( c => validCollections(c, ['users', 'products'])),
    fieldValidator,
], displayImage);

module.exports =router;