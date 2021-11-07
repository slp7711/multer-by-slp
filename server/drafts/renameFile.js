const renameFile = function (req, res, next) {
    console.log(req.file);
    
    console.log('Before rename file');

    // Rename the files with path
    const oldpath = path.join(__dirname, 'uploads', req.file.filename);
    const newpath = path.join(__dirname, 'uploads', req.file.originalname);

    // Rename the file without using path
    // const oldpath = `${__dirname}/uploads/${req.file.filename}`;
    // const newpath = `${__dirname}/uploads/${req.file.originalname}`;

    fs.rename(oldpath, newpath, (error) => {

        if(error) {
            //Show the error
            console.log(error);
        } else {
            console.log('File was renamed to: ' + newpath);
            console.log(oldpath);
        }
    })
}