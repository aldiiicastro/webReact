'use strict'

var express =  require('express');
var VideoController = require('../controlers/videos');
var router = express.Router();
//Configurar el multiparty 
var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './upload/videos'});

router.post('/save/video', VideoController.save);
router.get('/videos/:last?', VideoController.getVideos);
router.get('/video/:id', VideoController.getVideo);
router.put('/video/:id', VideoController.update);
router.delete('/video/:id', VideoController.delete);
router.post('/upload-imageV/:id', md_upload, VideoController.upload);
router.get('/get-imageV/:image', VideoController.getImage);
router.get('/search/:search', VideoController.search);
module.exports = router;