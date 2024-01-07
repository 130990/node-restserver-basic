const { response, request } = require("express");
const CategoryModel = require('../models/category');

const getCategories = async(req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const queryFilter = { state: true };

    const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(queryFilter),
        CategoryModel.find(queryFilter)
            .skip(from)
            .limit(Number(limit))
            .populate("user", "name")
    ]);

    return res.json({
        total,
        categories
    });
}
const getCategoryByID = async(req = request, res = response) => {
    const {id} = req.params;
    const queryFilter = { state: true, _id : id};

    const category = await CategoryModel.findOne(queryFilter).populate("user","name");

    return res.json({
        category
    });
}

const postCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoryExists = await cartegoryModel({ name });

    if (categoryExists) {
        res.status(400).json({
            msg: `Category: ${name} already exists`
        });
    }

    //generate data
    const data = {
        name,
        user: req.userAuth._id
    }

    const category = await cartegoryModel(data);

    await category.save();

    return res.json({
        category
    });
}

const putCategory = async(req = request, res = response)=>{
    const {id} = req.params;
    const {...categoryData} = req.body;
    //categoryData.user = req.userAuth.id;

    const category = await CategoryModel.findByIdAndUpdate(id, categoryData);
    await category.save();

    return res.json({
        category
    });
}

const deleteCategory = async(req = request, res = response)=>{
    const {id} = req.params;
    const category = await CategoryModel.findByIdAndUpdate(id, {state:false},{new: true});

    return res.json({
        category
    });
}

module.exports = {
    getCategories,
    getCategoryByID,
    postCategory,
    putCategory,
    deleteCategory
}