const { response, request } = require('express');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user');


const getUsers = async(req = request, res = response) => {
    // const { q, data, apikey } = req.query;
    const {limit = 5, from = 0} = req.query;
    const queryFilter = {state:true};
    const [total, users] = await Promise.all([
        UserModel.countDocuments(queryFilter),
        UserModel.find(queryFilter)
                        .skip(from)
                        .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}
const postUsers = async (req, res = response) => {
    const { name, email, role, password } = req.body;
    const user = new UserModel({ name, email, role, password });

    //generate encrypted password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //save
    await user.save();
    res.json({
        msg: 'test POST message - controller',
        user
    });
}
const putUsers = async(req, res = response) => {
    const {id} = req.params;
    const {password, google, email, ... userData} = req.body;

    if(password){
        const salt = bcrypt.genSaltSync();
        userData.password = bcrypt.hashSync(password,salt);
    }

    const user = await UserModel.findByIdAndUpdate(id, userData);

    res.json({
        user
    });
}
const deleteUsers =  async(req =request, res = response) => {
    const {id} = req.params;

    const user = await UserModel.findByIdAndUpdate(id, {state:false});

    res.json({
        user
    });
}


module.exports = {
    getUsers,
    postUsers,
    putUsers,
    deleteUsers
}