const mongoose = require('mongoose');

const dbConnection =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_CNX);
        console.log('Db online')

    } catch (error) {
        throw new Error('Database initialization error');
    }
}

module.exports ={
    dbConnection
}