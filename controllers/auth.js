const { response, request } = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

const login = async (req = request, res = response) => {
    const { email, password } = req.body;
    //console.log(email, password);
    try {
        const user = await UserModel.findOne({ email });
        
        //Validate user exists
        if (!user) return res.json({ msg: 'User/Password are incorrect. --email' });
        
        //Validate user is active
        if (!user.state) return res.json({ msg: 'User/Password are incorrect. --state => false' });
        
        //Validate if password is correct
        const validPass = bcrypt.compareSync(password, user.password);
        if (!validPass) return res.json({ msg: 'User/Password are incorrect. --password' });

        //Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error, contact tech support"
        });
    }

}

module.exports = {
    login
}