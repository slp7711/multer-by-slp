const express = require('express')
const PORT = process.env.port || 3000
const router = require('./routes/imoveisRoutes')


const app = express()

app.set('view engine', 'pug')
app.use('/api', router)


app.listen(PORT, () => {
    console.log('Server runniong on port ' + PORT);
});

