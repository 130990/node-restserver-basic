const fieldValidator = require('../middlewares/field-validator');
const jwtValidator = require('../middlewares/jwt-validator');
const roleValidator = require('../middlewares/role-validator');
const fileUploadValidator = require('../middlewares/file-upload-validator');

module.exports ={
    ...fieldValidator,
    ...jwtValidator,
    ...roleValidator,
    ...fileUploadValidator
}