
const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.palabrasPath = '/api/palabras';

        //Conectar a la base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de la aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );


        //Directorio público
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.palabrasPath, require('../routes/palabras'))
    }

    listen() {
        this.app.listen(this.port, () =>{
            console.log('Servidor corriendo en puerto', this.port)
        });
    }

}

module.exports = Server;