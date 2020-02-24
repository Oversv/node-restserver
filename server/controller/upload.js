const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../model/usuario');
const Producto = require('../model/producto');
const fs = require('fs')
const path = require('path')

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', (req, res) =>{
    
    let tipo = req.params.tipo
    let id = req.params.id

    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        })
    }

    //Validar tipo
    let tiposValidos=['productos', 'usuarios']

    if(tiposValidos.indexOf(tipo) <0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')                
            }
        })
    }

    //archivo sería el nombre que le damos al input file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[1]

    //Extensiones permitidas
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg']

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension 
            }
        })
    }

    //Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    //movemos el archivo al path que le indiquemos
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err)=> {
        
        if (err)
          return res.status(500).json({
              ok: false,
              err
        });
        
        if(tipo === 'usuarios'){

            imagenUsuario(id, res, nombreArchivo)      
        }

        if(tipo === 'productos'){
     
            imagenProducto(id, res, nombreArchivo)  
        }

    });
})

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) =>{
        
        if(err){

            borraArchivo(nombreArchivo, 'usuarios')

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB){

            borraArchivo(nombreArchivo, 'usuarios')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }
        
        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo

        usuarioDB.save( (err, usuarioGuardado) =>{

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    })

}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB) =>{
        
        if(err){

            borraArchivo(nombreArchivo, 'productos')

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){

            borraArchivo(nombreArchivo, 'productos')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }
        
        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo

        productoDB.save( (err, productoGuardado) =>{

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    })

}
/**
 * Elimina la imagen guardada en el sistema
 * @param {*} nombreImagen 
 * @param {*} tipo 
 */
function borraArchivo(nombreImagen, tipo){

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
        
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
    }
}
module.exports = app