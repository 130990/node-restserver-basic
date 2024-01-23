const {Category, Role, User, Product} = require('../models');

const isValidRole = async (role = '') => {
    const roleExists = await Role.findOne({ role });
    if (!roleExists) {
        throw new Error(`Role: ${role} is not valid`)
    }
}

const emailExists = async(email='') => {
    const emailExits = await User.findOne({ email });

    if (emailExits) {
        throw new Error(`The email: ${email}, was already registered.`);
    }
}
const userExists = async(id) => {
    const userExits = await User.findById(id);

    if (!userExits) {
        throw new Error(`The ID: ${id}, doesn't exist.`);
    }
}
const categoryExists = async(id) => {
    const category = await Category.findById(id);

    if (!category) {
        throw new Error(`The category with ID: ${id}, doesn't exist.`);
    }
}
const productExists = async(id) => {
    const product = await Product.findById(id);

    if (!product) {
        throw new Error(`The product with ID: ${id}, doesn't exist.`);
    }
}

const validCollections =(collection ='', collections =[])=>{
    const isIncluded = collections.includes(collection);
    if(!isIncluded){
        throw new Error(`Collection ${collection} is not valid`)
    }

    return true;
}

module.exports = {
    isValidRole,
    emailExists,
    userExists,
    categoryExists,
    productExists,
    validCollections
}