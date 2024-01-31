const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config');
const fileUpload = require('express-fileupload');
const {createServer} = require('http');
const { socketController } = require('../sockets/socketController');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            category: '/api/categories',
            product: '/api/products',
            search: '/api/searches', 
            user: '/api/users' ,
            upload: '/api/uploads'
        };
        
        //CONNECT TO DB
        this.connectDB();

        //MIDDLEWARE
        this.middlewares();

        //ROUTES
        this.routes();

        //SOCKETS
        this.sockets();
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

        //FILE UPLOAD
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.category, require('../routes/category'));
        this.app.use(this.paths.product, require('../routes/product'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.user, require('../routes/user'));
        this.app.use(this.paths.upload, require('../routes/upload'));
    }

    sockets(){
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server running at', this.port);
        })
    }
}

module.exports = Server;