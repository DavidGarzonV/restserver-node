const jwt = require('jsonwebtoken');
//====================
//Verificar token
//====================

let verificaToken = (req,res,next) =>{

    let token =  req.get('token'); //Header
                                             //payload
    jwt.verify( token, process.env.seed, (err,decoded) =>{
        
        if (err) {
            return res.status(401).json({
                ok: false,
                err : {
                    message: 'Token Inválido'
                }
            });
        }

        req.usuario = decoded.usuario;
        //next ejecuta todo lo que va despues del middleware
        next();


    });    

}   

//====================
//Verificar ADMIN ROLE
//====================



let verificaAdmin = (req,res,next) =>{

    let usuario =  req.usuario;
    
    if(usuario.role === 'ADMIN_ROLE'){
        next();        
    }else{
        return res.status(401).json({
            ok: false,
            err : {
                message: 'No tiene el rol de administrador'
            }
        });
    }
}   


module.exports = {
    verificaToken,
    verificaAdmin
}