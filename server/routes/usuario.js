const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');


const Usuario = require('../models/usuario');

const { verificaToken,verificaAdmin } =  require('../middlewares/autenticacion')


app.get('/usuario', verificaToken ,function (req, res) {
    
    //parametros opcionales
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    // Usuario.find({ google: true })
    // Usuario.find({ },'nombre email role estado google img')
    Usuario.find({ estado: true })
            .skip(desde)
            .limit(limite)
            .exec( (err,usuarios) =>{

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({estado: true},(err, conteo)=>{

                    res.json({
                        ok: true,
                        cantidad : conteo,
                        usuarios
                    });
                });


           });    

});

app.post('/usuario', [verificaToken,verificaAdmin] ,function (req, res) {
    //BODY - PARSER OBTIENE DATOS X-FORM POST-PUT-DELETE
    let body = req.body;

    //Instancia del esquema de usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //para que no se muestre la contraseña en el objeto.
    // usuarioDB.password=null;    

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', [verificaToken,verificaAdmin],function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);    

    //NEW DEVUELVE EL OBJETO ACTUALIZADO Y NO EL ORIGINAL
    //RUN VALIDATORS EJECUTA VALIDACIONES DEFINIDAS EN ESQUEMMA  
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.delete('/usuario/:id',[verificaToken,verificaAdmin], function (req, res) {
    
    let id = req.params.id;


    //Eliminar fisicamente
    // Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if(!usuarioBorrado){
    //         return res.status(400).json({
    //             ok: false,
    //             err : {
    //                 message :"Usuario no encontrado"
    //             }
    //         });
    //     }

    //     res.json({
    //         ok:true,
    //         usuario : usuarioBorrado
    //     })

    // });
       

    Usuario.findByIdAndUpdate(id, {estado : false}, { new: true}, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,            
            usuario: usuarioDB
        });

    });


});

module.exports = app;