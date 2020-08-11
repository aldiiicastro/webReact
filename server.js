'use strict'

//Cargar modulos de NODEjs para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var env = process.env.NODE_ENV
//Ejecutar express para trbajar con http
var app = express();

//Cargar ficheros rutas
var article_routes = require('./routes/article');
var video_routes = require('./routes/video');

//Cargar middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//Activar el cors
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a rutas
app.use('/', article_routes);
app.use('/', video_routes);

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {   
        console.log('La conexion a la base de datos se ha realizado bien');
        //Crear servidor y escuchar peiticones    
    });

if (env === 'production') {
     app.get('/', express.static(`${__dirname}/fronted/build`))
}

var port =  process.env.PORT || 3100;
app.listen(port, function () {
    console.log(`App running on port ${port}`); 
});   

//Exportar el modulo
module.exports = app;
