var express = require('express')
var app = express()
var bodyParser = require('body-parser');
const cors = require('cors');
var fetchuser=('../middleware/fetchuser')
// var mongoose = require('mongoose')
const router=express.Router();
// var fs = require('fs');
// var path = require('path');
var multer = require('multer');
var cloudinary = require('cloudinary').v2;
require('dotenv/config');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });
var imgModel = require('../models/photo');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
router.get('/fetchallphotos', async(req, res) => {
    try {
        const photos= await imgModel.find({user:req.user.token});
        res.json(photos)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server Error")
        
    }
});
router.post('uploadImage', upload.single('image'), (req, res, next) => {

    const data = {
        image: req.file.path
    }
    cloudinary.uploader.upload(data.image)
    .then((result)=>{
        const image = new imgModel({
            img: result.url
        });
        const response = image.save();
        res.status(200).send({
        message: "success",
        result
        });
    }).catch((error) => {
        res.status(500).send({
        message: "failure",
        error
        });
    });
});
// mongoose.connect(process.env.MONGO_URL,
//     { useNewUrlParser: true, useUnifiedTopology: true }, err => {
//         console.log('connected')
//     });
// app.listen('3000' || process.env.PORT, err => {
//     if (err)
//         throw err
//     console.log('Server started')
// })
module.exports=router