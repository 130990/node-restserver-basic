const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require('../models');
const { models } = require("mongoose");

const uploadFiles = async (req, res = response) => {
    try {

        const fileResult = await uploadFile(req.files, undefined, 'imgs');
        return res.json({ msg: fileResult });
    } catch (errorMessage) {
        res.status(400).json({ msg: errorMessage })
    }

}

const imageUpdate = async (req, res = response) => {
    const { collection, id } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);

            if (!model) {
                return res.status(500).json({ msg: `User with id: ${id}` });
            }
            break;

        case 'products':
            model = await Product.findById(id);

            if (!model) {
                return res.status(500).json({ msg: `Product with id: ${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: `Value was not mapped` });
    }

    //Clean previous imgs
    if (model.img) {
        //delete server img
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);

        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg); //<= delete file
        }
    }

    const fileResult = await uploadFile(req.files, undefined, collection);
    model.img = fileResult;

    await model.save();

    res.json({
        model
    });
}
const imageUpdateCloudinary = async (req, res = response) => {
    const { collection, id } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);

            if (!model) {
                return res.status(500).json({ msg: `User with id: ${id}` });
            }
            break;

        case 'products':
            model = await Product.findById(id);

            if (!model) {
                return res.status(500).json({ msg: `Product with id: ${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: `Value was not mapped` });
    }

    //Clean previous imgs
    if (model.img) {
        const pathArr = model.img.split('/');
        const imgName = pathArr[pathArr.length -1];

        const [public_id] = imgName.split('.');
        
        cloudinary.uploader.destroy(public_id);
        //cloudinary.api.delete_resources(public_id); //<= API implementation
    }

    const {tempFilePath} = req.files.File;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    
    model.img = secure_url;
    await model.save();

    res.json({model});
 }

const displayImage = async (req, res = response) => {
    const { collection, id } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);

            if (!model) {
                return res.status(500).json({ msg: `User with id: ${id}` });
            }
            break;

        case 'products':
            model = await Product.findById(id);

            if (!model) {
                return res.status(500).json({ msg: `Product with id: ${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: `Value was not mapped` });
    }

    //Verify previous imgs
    if (model.img) {
        //get server img
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);

        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg);
        }
    }

    const defaultNoImgPath = path.join(__dirname, '../assets/img', 'no-image.jpg');
    return res.sendFile(defaultNoImgPath);
}

module.exports = {
    uploadFiles,
    imageUpdate,
    imageUpdateCloudinary,
    displayImage
}