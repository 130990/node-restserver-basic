const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            category: '/api/categories',
            product: '/api/products',
            search: '/api/searches', 
            user: '/api/users' 
        };
        
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
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.category, require('../routes/category'));
        this.app.use(this.paths.product, require('../routes/product'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.user, require('../routes/user'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running at', this.port);
        })
    }
}

module.exports = Server;