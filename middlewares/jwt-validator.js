const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const {User} = require('../models');


const jwtValidator = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No token was provided'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const userAuth = await User.findOne({_id: uid});
        
        //Verify is user exists
        if(!userAuth.state){
            return res.status(401).json({
                msg: 'Token not valid -- user do not exists'
            });
        }

        //Verify is user is active
        if(!userAuth.state){
            return res.status(401).json({
                msg: 'Token not valid -- user inactive'
            });
        }

        req.userAuth = userAuth;

        next();
    } catch (error) {
        console.log(error);

        return res.status(401).json({
            msg: 'Token not valid'
        });
    }
}

module.exports = {
    jwtValidator
}