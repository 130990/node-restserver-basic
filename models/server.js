const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api/users';
        this.authPath = '/api/auth';
        
        //CONNECT TO DB
        this.connectDB();

        //MIDDLEWARE
        this.middlewares();

        //ROUTES
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //WRITE & BODY CAST
        this.app.use(express.json());

        //PUBLIC STATIC FOLDER
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.userPath, require('../routes/user'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running at', this.port);
        })
    }
}

module.exports = Server;