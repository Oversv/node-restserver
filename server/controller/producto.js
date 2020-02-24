const express = require('express')
const _ = require('underscore')

let {verificaToken} = require('../middlewares/autenticacion')

let app = express()

let Producto = require('../model/producto')

/**
 * Buscar productos
 */
app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex})
    .populate('categoria', 'nombre')
    .exec((err, productos) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productos
        })

    })
})

/**
 * Obtener todos los productos
 */
app.get('/productos', verificaToken, (req, res)=>{

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    Producto.find({disponible: true})   
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .skip(desde)
    .limit(limite)
    .exec((err, producto) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto        
        })
   })
})

/**
 * Obtener un producto por ID
 */
app.get('/productos/:id', verificaToken, (req, res)=>{    

    let id = req.params.id    

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) =>{
 
         if(err){
             return res.status(500).json({
                 ok: false,
                 err
             })
         }
 
         if(!productoDB){
             return res.status(400).json({
                 ok: false,
                 err: {
                     message: 'El ID no es correcto'
                 }
             })
         }   
 
         res.json({
             ok: true,            
             producto: productoDB       
         })
    })
})

/**
 * Crear un nuevo producto
 */
app.post('/productos', verificaToken, (req, res)=>{

    let body = req.body

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria 
    })

    producto.save((err, productoDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        } 

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
})

/**
 * Actualizar un producto
 */
app.put('/productos/:id', verificaToken, (req, res)=>{
    
    let id = req.params.id

    let body = _.pick(req.body,['nombre', 'descripcion', 'precioUni', 'categoria', 'disponible'])

    Producto.findOneAndUpdate({_id: id}, body, {new: true, runValidators: true},((err, productoDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se ha podido actualizar"
                }
            })
        } 

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }  

        res.json({
            ok: true,
            producto: productoDB
        })
    }))

})

/**
 * Borrar un producto
 */
app.delete('/productos/:id', verificaToken, (req, res)=>{

    let id = req.params.id

    let cambiaDisponibilidad = {
        disponible: false
    }

    Producto.findOneAndUpdate({_id: id}, cambiaDisponibilidad, {new: true, runValidators: true},((err, productoDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se ha podido eliminar"
                }
            })
        } 

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }  

        res.json({
            ok: true,
            message: 'El producto ya no está disponible',
            producto: productoDB
        })
    }))   
})

module.exports = app