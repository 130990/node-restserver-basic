const jwt = require('jsonwebtoken');

const generateJWT = (uid) =>{
    return new Promise((resolve, reject)=>{
        const payload ={uid};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn:'4h'
        },(err, token)=>{
            if(err){
                console.log(err);
                reject(`Token couldn't be generated`);
            }
            else{
                resolve(token);
            }
        })
    });
}

module.exports ={
    generateJWT
}