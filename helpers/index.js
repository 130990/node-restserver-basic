const dbValidators = require('./db-validators');
const generateJwt = require('./generate-jwt');
const googleValidator = require('./google-validator');
const uploadFile = require('./upload-file');

module.exports = {
    ...dbValidators,
    ...generateJwt,
    ...googleValidator,
    ...uploadFile
}