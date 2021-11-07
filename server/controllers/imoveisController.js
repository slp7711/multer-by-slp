const mongoose = require('mongoose')
const path = require('path')
const util = require('util')
const stream = require('stream')
const fs = require('fs')

const Imovel = require('../models/imoveis')
require('dotenv').config()

// Making connection to mongoDB
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => {
    console.log('We are connected!');    
});
        


//Defining routes
const register_form = (req, res) => {
    // res.send('Hello multer blabla');
    // res.sendFile(path.join(__dirname, '../index.html'));
    // res.sendFile(path.join(__dirname, '..', 'views', 'index-files.html'));
    res.render('index')

    // console.log('from api-file api')
    console.log('from pug template api')
}



const download_file = (req, res) => {

    //Creating a bucket to download a file from mongo db
    const bucket = new mongoose.mongo.GridFSBucket(db.db, {
        bucketName: 'images'
    });

    //bucket.openDownloadStreamByName('fotoSergio.jpeg')
    bucket.openDownloadStreamByName(req.params.filename)
        //The next line will save de file on our server 
            //.pipe(fs.createWriteStream('./sample-download.jpeg'))
        //The next line will send the file to res and display on browse
        .pipe(res)
        .on('error', ()=>{
            console.log("An error occurred...");
            res.send(error);
        })
        .on('finish', ()=> {
            console.log("done downloading");
            //res.send('Done Downloding');
        });
}

const register_new_property = (req, res) => {

    // Creating a bucket and saving in database
    const bucket = new mongoose.mongo.GridFSBucket(db.db, {
        bucketName: 'images'
    });

    //Configuring a pipeline used to save files on db
    const pipeline = util.promisify(stream.pipeline);

    const files = req.files
    const imagesNames = []

    async function run(file, uploadStream) {
        await pipeline (
            fs.createReadStream(__dirname + '/../uploads/' + file),
            uploadStream
        );

        console.log('File saved on db')
        
        // Deleting file in the server
        fs.unlink(__dirname + '/../uploads/' + file, (err) => {
            if (err) {
                console.log(err)
            }
            console.log('File removed from the server!!!')
            //return
        })
        
    }


    files.forEach(file => {

        //Configuring the file name to be saved on db
        const fileName = file.filename;
        const extension = file.originalname.split('.').pop();
        const fileNameToBeSavedOnDB = `${fileName}.${extension}`;

        //Pushing file to new array
        imagesNames.push(fileNameToBeSavedOnDB)

        console.log('file renamed')

        //Saving the file with the name generated by multer plus the extension of the original file
        const uploadStream = bucket.openUploadStream(fileNameToBeSavedOnDB)



        run(fileName, uploadStream).catch(console.error);

    })

    console.log(imagesNames)


    // Creating and saving a new instance of Imovel

    const { type, description, price } = req.body;

    // Please change the values proprities on Imovel.create

    Imovel.create({
        type,
        description,
        price,
        imagesNames
    }).then(function(imovel){
        //res.send(imovel);
        res.render('response', {type: imovel.type, description: imovel.description, price: imovel.price});
        console.log('Document created...');
    }).catch(error => {
        console.log(error);
        res.send('Impossible to create document: ' + error)
    })

}

const delete_form = (req, res) => {
    console.log('You want to delete a property!!')
    res.render('delete')
}

const delete_property = (req, res) => {

    console.log('You delete a property')

    const { propertyId } = req.body

    console.log(propertyId)

    res.send('You delete a property')


}

module.exports = {
    register_form,
    download_file,
    register_new_property,
    delete_form,
    delete_property
}