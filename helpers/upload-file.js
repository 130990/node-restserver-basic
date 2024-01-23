const  path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, validFileExtensions = ['jpg', 'png', 'jpeg', 'gif'], folder ='') => {
    return new Promise((resolve, reject) => {
        const { File } = files;
        const fileName = File.name.split('.');
        const fileExtension = fileName[fileName.length - 1];

        if (!validFileExtensions.includes(fileExtension)) {
            return reject(`Extension ${fileExtension} isn't valid`)
        }

        const tempFileName = `${uuidv4()}.${fileExtension}`;

        uploadPath = path.join(__dirname, '../uploads/', folder, tempFileName);

        File.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve(tempFileName);
        });
    });
}

module.exports = {
    uploadFile
}