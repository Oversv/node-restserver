const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
<<<<<<< HEAD
    img: {type: String, required: false},
=======
>>>>>>> dd0ad7ab4dd3bb37d3c10dfb853582104fd1dae9
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Producto', productoSchema);