const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: 'uploads/'})

const imoveisController = require('../controllers/imoveisController')


// Defining routes
router.get('/', imoveisController.register_form);

router.get('/download/:filename', imoveisController.download_file);

router.post('/register-new-property', upload.array('photos', 15), imoveisController.register_new_property);

router.get('/delete_form', imoveisController.delete_form);

router.post('/delete_property', upload.none(), imoveisController.delete_property);


module.exports = router;