const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

//Especificamos los roles válidos para registrar un usuario
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img:{
        type: String,
        required: false
    },
    role: {  
        type: String,      
        default: 'USER_ROLE',
        enum: rolesValidos //Se indica el objeto donde están guardados los roles válidos
    }, 
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
})

//Función para que no se muestre el campo password, no se tiene que usar un arrow function
usuarioSchema.methods.toJSON = function (){
    
    let user = this
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}

//Para personalizar el mensaje de error cuando salta el error de email duplicado, se hace con el plugin mongoose-unique-validator
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})

//Exportamos usuarioSchema pero le damos un nuevo nombre, este es Usuario
module.exports = mongoose.model('Usuario', usuarioSchema)