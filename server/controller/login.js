const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../model/usuario')

const app = express()

app.post('/login', (req, res) =>{

    let body = req.body

    /**
     * Comprobamos el usuario y contraseña
     * El método findOne nos retornará los datos de la query que almacenaremos en usarioDB
     * En caso de que el usuario no exista retornamos un error
     * Lo siguiente es comprobar si la contraseña con compareSync, método de bcript
     */
    Usuario.findOne({email: body.email}, (err, usuarioDB) =>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        } 

        if(!usuarioDB){
           
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            })
             
        }

        //El metodo compareSync compara la contraseña que introdujo el usuario con la que tenemos almacenada del usuario, en caso de que no sean iguales se retorna un error
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
           
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            })             
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
        
        //Retornamos la información del usuario
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
        
    })
})

module.exports = app;