const { response, request } = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-validator');

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

const googleSignIn = async (req = request, res = response) =>{
    const {id_token} = req.body;

    try {
        const {name, email, picture} = await googleVerify(id_token);
        
        let user = await UserModel.findOne({email});
       
        //User doesn't exists in db
        if(!user){
            const data ={
                name,
                email,
                password: 'DefaultPass',
                picture,
                state: true,
                role: 'USER_ROLE',
                google: true
            };
            
            user = new UserModel(data);
            await user.save();
        }

        //User exists and is inactive
        if(!user.state){
            return res.status(401).json({
                msg: 'User is inactive, contact the administrator'
            });
        }

        //Generate JWT
        const token = await generateJWT(user.id);

        return res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error) 
        return res.status(400).json({
            ok: false,
            msg: `Token can't be verified`
        });
    }

}
module.exports = {
    login,
    googleSignIn
}