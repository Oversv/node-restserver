const jwt = require('jsonwebtoken');

//=================
// Verificar Token
//=================

let verificaToken =(req, res, next) =>{
    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decoded) =>{ 
        
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario

        next() //El next se usa para que en caso de que las verificaciones que hace el middleware sean correctas, se continue con la función

    })  
}

//=================
// Verificar AdminRole
//=================

let verificaAdminRole = (req, res, next) =>{
    let usuario = req.usuario

    if(usuario.role === 'ADMIN_ROLE'){
        next()
        
    }else{

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }
}

//========================
// Verificar Token Imagen
//========================

let verificaTokenImg = (req, res, next) =>{
    
    let token = req.query.token

    jwt.verify(token, process.env.SEED, (err, decoded) =>{ 
        
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario

        next() //El next se usa para que en caso de que las verificaciones que hace el middleware sean correctas, se continue con la función
    })
}

module.exports ={
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}