require("./config/config")
const express = require('express')
const mongoose = require('mongoose');
const path = require('path')
const app = express()
const bodyParser = require('body-parser') 


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

//Configuración global de rutas
app.use(require('./controller/index'))

//Coneción mongoDB --Antigua
mongoose.connect(process.env.URLDB, 
                  {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true},
                  (err) =>{
    
    if(err) throw err
    console.log('Base de datos ONLINE!');
})

//Nueva conexión para mongoDB
/* await mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); */
 
app.listen(process.env.PORT, () =>console.log("Escuchando el puerto: ", process.env.PORT))