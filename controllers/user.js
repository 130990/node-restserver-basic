const {response, request} = require('express');


const getUsers = (req = request, res = response) => {
    const {q,data,apikey} = req.query;
    res.json({
        msg: 'test GET message - controller',
        q,
        data,
        apikey
    });
}
const postUsers = (req, res = response) => {
    const { name, age } = req.body;
    res.json({
        msg: 'test POST message - controller',
        name,
        age
    });
}
const putUsers = (req, res = response) => {
    const id = req.params.id;
    res.json({
        msg: 'test PUT message - controller',
        id
    });
}
const deleteUsers = (req, res = response) => {

    res.json({
        msg: 'test DELETE message - controller'
    });
}


module.exports = {
    getUsers,
    postUsers,
    putUsers,
    deleteUsers
}