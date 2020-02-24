const express = require('express')
const _ = require('underscore')

let {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion')

let app = express()

let Categoria = require('../model/categoria')

/**
 * Muestra todas las categorias
 */
app.get('/categoria', verificaToken, (req, res)=>{

   Categoria.find()
    .sort('descripcion')
    .populate('usuario', 'nombre email') //Con populate indicamos que se muestren campos de otra tabla
    .exec((err, categoria) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria        
        })
   })

})

/**
 * Muestrar una categoría por ID
 */
app.get('/categoria/:id', verificaToken, (req, res)=>{
  
    let id = req.params.id    

   Categoria.findById(id).exec((err, categoriasDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriasDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }   

        res.json({
            ok: true,            
            categoria : categoriasDB       
        })
   })
})


/**
 * Crear nueva categoria
 */
app.post('/categoria', verificaToken, (req, res)=>{
    
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }        

        if(!categoriaDB){
            return res.status(500).json({
                ok: false,
                err
            })
        }    
       
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

 })

 /**
 * Actualiza el nombre de la categoria
 */
app.put('/categoria/:id', verificaToken, (req, res)=>{
    
    let id = req.params.id

    let body = _.pick(req.body,['descripcion'])

    Categoria.findOneAndUpdate({_id: id}, body, {new: true, runValidators: true},((err, categoriaDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se ha podido actualizar"
                }
            })
        } 

        if(!categoriaDB){
            return res.status(500).json({
                ok: false,
                err
            })
        }  

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    }))
 })
 

  /**
 * Elimina una categoria
 */
app.delete('/categoria/:id', [verificaToken, verificaAdminRole ], (req, res)=>{

    let id = req.params.id    

    Categoria.findByIdAndRemove({_id: id}, ((err, categoriaBorrada)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se ha podido eliminar"
                }
            })
        } 

        if(!categoriaBorrada){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        } 

        res.json({
            ok: true,
            message: 'Categoría borrada'
        })
    }))

 })





module.exports = app