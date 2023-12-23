const RoleModel = require('../models/role');
const UserModel = require('../models/user');

const isValidRole = async (role = '') => {
    const roleExists = await RoleModel.findOne({ role });
    if (!roleExists) {
        throw new Error(`Role: ${role} is not valid`)
    }
}

const emailExists = async(email='') => {
    const emailExits = await UserModel.findOne({ email });

    if (emailExits) {
        throw new Error(`The email: ${email}, was already registered.`);
    }
}
const userExists = async(id) => {
    const userExits = await UserModel.findById(id);

    if (!userExits) {
        throw new Error(`The ID: ${id}, doesn't exist.`);
    }
}

module.exports = {
    isValidRole,
    emailExists,
    userExists 
}