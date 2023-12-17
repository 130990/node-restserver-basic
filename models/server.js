const express = require('express')
const cors = require('cors')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api/users';

        //MIDDLEWARE
        this.middlewares();

        //ROUTES
        this.routes();
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
        this.app.use(this.userPath, require('../routes/user'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running at', this.port);
        })
    }
}

module.exports = Server;