/**
 * Endpoints
 */
const express = require('express')
const app = express()

app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./categoria'))
app.use(require('./producto'))
<<<<<<< HEAD
app.use(require('./upload'))
app.use(require('./imagenes'))
=======
>>>>>>> dd0ad7ab4dd3bb37d3c10dfb853582104fd1dae9

module.exports = app;