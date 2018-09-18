const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


app.post('/login', (req, res) => {
    
    let body = req.body;

    Usuario.findOne({email : body.email}, (err,usuarioDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err : {
                    message : 'Usuario incorrectos'
                }
            });
        }

        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err : {
                    message : 'Contraseña incorrectos'
                }
            });
        }

        //30 dias
        let token = jwt.sign({
            //payload = informacion usuario
            usuario : usuarioDB
        },process.env.SEED,{expiresIn: process.env.caducidad_token})
                

        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        })
        


    })

});


module.exports = app;