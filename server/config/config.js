//==============
// Puerto
//==============

//Lee el puerto donde se está ejecutando, en caso de que no tenga ningún puerto se le asigna el 3000  
process.env.PORT = process.env.PORT || 3000

//==============
// Entorno
//==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//=======================
// Vencimiento del token
//=======================
process.env.CADUCIDAD_TOKEN = '48h'

//==============
// Seed
//==============
process.env.SEED = process.env.SEED || 'seed'

//==============
// Base de datos
//==============
let urlDB;

//Este if comprueba si el process está en desarrollo (dev), en ese caso se le asigna la conexión a la base de datos en local, en caso contrario asignamos la cadena de conexión donde tenemos subida nuestra base de datos. 
    if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI //Variable de entorno creada por nosotros en Heroku
}

//URLDB es un tipo de environment que nosotros creamos y le asignamos la conexión a la DB.
process.env.URLDB = urlDB;

//==============
// Google client ID
//==============
process.env.CLIENT_ID = process.env.CLIENT_ID || '823085514008-hv7tf1sjfk71suas7jq8qftfg0ccnut7.apps.googleusercontent.com'