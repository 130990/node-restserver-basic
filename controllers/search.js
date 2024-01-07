const { response, request } = require("express");
const { isValidObjectId } = require("mongoose");
const { User, Category, Role, Product } = require('../models');
const category = require("../models/category");

const collectionsAllowed = [
    'users',
    'categories',
    'products',
    'roles',
];

const searchUsers = async (searchValue = '', res = response) => {
    const isMongoValid = isValidObjectId(searchValue);

    if (isMongoValid) {
        const user = await User.findById(searchValue);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    //Regular Expression to made insensible to Capitalization
    const regex = new RegExp(searchValue, 'i');

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    });

    return res.json({
        results: users
    });
}

const searchCategories = async (searchValue = '', res = response) => {
    const isMongoValid = isValidObjectId(searchValue);

    if (isMongoValid) {
        const category = await Category.findById(searchValue);
        return res.json({
            results: (category) ? [category] : []
        });
    }

    //Regular Expression to made insensible to Capitalization
    const regex = new RegExp(searchValue, 'i');

    const categories = await Category.find({
        $or: [{ name: regex }],
        $and: [{ state: true }]
    });

    return res.json({
        results: categories
    });
}

const searchProducts = async (searchValue = '', res = response) => {
    const isMongoValid = isValidObjectId(searchValue);

    if (isMongoValid) {
        const product = await Product.findById(searchValue).populate('category', 'name').exec();
        return res.json({
            results: (product) ? [product] : []
        });
    }

    //Regular Expression to made insensible to Capitalization
    const regex = new RegExp(searchValue, 'i');

    const products = await Product.find({
        $or: [{ name: regex }, { price: { $eq: searchValue } }],
        $and: [{ state: true }]
    }).populate('category', 'name').exec();

    return res.json({
        results: products
    });
}

const search = async (req = request, res = response) => {
    const { collection, searchValue } = req.params;

    if (!collectionsAllowed.includes(collection)) {
        return res.status(400).json({
            msg: `Allowed collections are: ${collectionsAllowed}`
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(searchValue, res);
            break;
        case 'categories':
            searchCategories(searchValue, res);
            break;
        case 'products':
            searchProducts(searchValue, res);
            break;
        case 'roles':
            break;
        default:
            return res.status(500).json({
                msg: 'Opps!! ... This search is not mapped yet.'
            });
            break;
    }
}

module.exports = {
    search
}