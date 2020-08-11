'use strict'

var validador = require('validator');
var Videos = require('../models/videos');
var fs = require('fs');
var path = require('path');


var controller = {
   datosGasti: (req, res) => {
        return res.status(200).send({
            curso: 'Master en FrameWorks',
            autor: 'Aldana Castro',
            url: 'google.com.ar'
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Accion del test del controlador'
        });
    },

    save: (req, res) => {
        //Juntar los parametros por post
        var params = req.body;

        //Validar datos
        try {
            var validate_title = !validador.isEmpty(params.title);
            var validate_video = !validador.isEmpty(params.video);

        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_video) {
            //Crear el objeto a guardar
            var video = new Videos();
            //Asignar valores
            video.title = params.title;
            video.image = null;
            video.video = params.video;
            //Guardar 
            video.save((err, videoStored) => {
                if (err || !videoStored) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    });
                }
                //Respuesta
                return res.status(200).send({
                    status: 'success',
                    video
                });
            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },

    getVideos: (req, res) => {
        var query = Videos.find({});
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }
        //Find
        query.sort('-_id').exec((err, videos) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }

            if (!videos) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos'
                });
            }
            return res.status(200).send({
                status: 'success',
                videos
            });
        });
    },

    getVideo: (req, res) => {
        //Tomar el id de la url
        var videoID = req.params.id;
        //Comprobar que existe
        if (!videoID || videoID == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe'
            });
        }
        //Buscar el articulo
        Videos.findById(videoID, (err, video) => {
            if (err || !video) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe'
                });
            }
            //Devolverlo
            return res.status(200).send({
                status: 'success',
                video
            });
        });

    },
    update: (req, res) => {
        // Recoletar el id del articulo por la url
        var videoID = req.params.id;
        //Recoger los datos que llegan por put
        var params = req.body;

        try {
            var validate_title = !validador.isEmpty(params.title);
            var validate_content = !validador.isEmpty(params.content);
            var validate_producer = !validador.isEmpty(params.producer);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos'
            });
        }
        if (validate_title && validate_content && validate_producer) {
            //Find and update
            Videos.findOneAndUpdate({ _id: videoID }, params, { new: true }, (err, videoUpdate) => {
                if (err || !videoUpdate) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    video: videoUpdate
                });
            });
        } else {
            //devolver respuesta
            return res.status(404).send({
                status: 'error',
                message: 'El articulo no se ha guardado'
            });
        }
    },

    delete: (req, res) => {
        // Recoletar el id del articulo por la url
        var videoID = req.params.id;
        //Find and update
        Videos.findOneAndDelete({ _id: videoID }, (err, videoRemoved) => {
            if (err || !videoRemoved) {
                return res.status(500).send({
                    status: 'error',
                    message: 'El articulo no se ha elimado'
                });
            }
            //devolver respuesta
            return res.status(200).send({
                status: 'success',
                video: videoRemoved
            });
        });
    },

    upload: (req, res) => {
        //Recolectar el fichero
        var file_name = 'Imagen no subida';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //Conseguir el nombre y la extension
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        //Nombre del archivo
        var file_name = file_split[2];

        //Extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        //Comprobar la extension
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            //Borrar el archivo subdio
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                });
            });
        } else {
            var videoID = req.params.id;
            //Buscar el articulo, asignarle el nombre de la imagen
            Videos.findOneAndUpdate({ _id: videoID }, { image: file_name }, { new: true }, (err, videoImage) => {
                if (err || !videoImage) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen del articulo'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    video: videoImage
                });
            });
        }
    },

    getImage: (req, res) => {
        //Sacar el fichero
        var file = req.params.image;
        //Sacar el path
        var path_file = './upload/videos/' + file;

        fs.exists(path_file, (exists) => {
            console.log(path_file);
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Videos.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } },
                { "producer": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, videos) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticiÃ³n !!!'
                    });
                }

                if (!videos || videos.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu busqueda !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    videos
                });

            });
    }

};

module.exports = controller;