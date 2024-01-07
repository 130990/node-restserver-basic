const { response, request } = require("express");
const { Product } = require('../models');

const getProducts = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const queryFilter = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(queryFilter),
        Product.find(queryFilter)
            .skip(from)
            .limit(Number(limit))
            .populate("user", "name")
    ]);

    return   res.json({
        total,
        products
    });
}
const getProductByID = async (req = request, res = response) => {
    const { id } = req.params;
    const queryFilter = { state: true, _id: id };

    const product = await Product.findOne(queryFilter).populate("user", "name");

    return res.json({
        product
    });
}

const postProduct = async (req = request, res = response) => {
    const { name, price, category } = req.body;

    const productExists = await Product.findOne({ name });

    if (productExists) {
        return res.status(400).json({
            msg: `Product: ${name} already exists`
        });
    }

    //generate data
    const data = {
        name,
        category,
        price,
        user: req.userAuth._id
    }

    const product = await Product(data);

    try {

        await product.save();
        return res.json({
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: error
        });
    }
}

const putProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { ...productData } = req.body;

    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    await product.save();

    return res.json({
        product
    });
}

const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

    return res.json({
        product
    });
}

module.exports = {
    getProducts,
    getProductByID,
    postProduct,
    putProduct,
    deleteProduct
}