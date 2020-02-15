//==============
// Puerto
//==============

//Lee el puerto donde se está ejecutando, en caso de que no tenga ningún puerto se le asigna el 3000  
process.env.PORT = process.env.PORT || 3000

//==============
// Entorno
//==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==============
// Base de datos
//==============
let urlDB;

//Este if comprueba si el process está en desarrollo (dev), en ese caso se le asigna la conexión a la base de datos en local, en caso contrario asignamos la cadena de conexión donde tenemos subida nuestra base de datos. 
    if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = 'mongodb+srv://AMDV:I1af7v2y8kdrr5UK@cluster0-ymodc.mongodb.net/cafe'
}

//URLDB es un tipo de environment que nosotros creamos y le asignamos la conexión a la DB.
process.env.URLDB = urlDB;