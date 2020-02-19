const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();   

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture, 
        google: true
    }

}


app.post('/google', async (req, res) =>{
    
    let token = req.body.idtoken

    let googleUser = await verify(token)
                    .catch(err =>{
                        return res.status(403).json({
                            ok: false,
                            err
                        })
                    })


    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        } 

        if(usuarioDB){
            
            if(usuarioDB.google === false){

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su atuenticación normal'
                    }
                })
            }else{

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        }else{

            //Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario()

            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = true
            usuario.password = ':)'

            usuario.save((err, usuarioDB)=>{

                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                } 

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            })
        }

    })
 
})

module.exports = app;