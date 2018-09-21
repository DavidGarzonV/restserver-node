const express = require('express');
const app = express();

const { verificaToken } =  require('../middlewares/autenticacion');
const Producto = require('../models/producto');

app.get('/producto', verificaToken ,function (req, res) {
    
    //parametros opcionales
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible:true})
            .skip(desde)
            .limit(limite)
            .populate('categoria')
            .populate('usuario')
            .exec( (err,productos) =>{

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.status(201).json({
                    ok: true,                    
                    productos
                });

           });    

});


app.get('/producto/:id', verificaToken,(req,res) =>{
        
    let id = req.params.id;

    Producto.findById(id)
    .populate('categoria')
    .populate('usuario')
    .exec( (err,productodb) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok:true,
            producto : productodb
        })
   });    
});


//BUSCAR PRODUCTOS

app.get('/producto/buscar/:termino',verificaToken, (req,res )=>{

    let termino = req.params.termino;

    //Expresion regular, i para que sea insensible a las mayus y minusc
    let regex= new RegExp(termino,'i');

    Producto.find({ nombre: regex })
        .populate('categoria','descripcion')
        .exec((err,productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                productos
            })
        });

});



app.post('/producto', verificaToken, (req,res) =>{
    
    let body = req.body;
    
    let producto = new Producto({
        nombre: body.nombre,
        precioUni : body.precioUni,
        descripcion : body.descripcion,
        categoria : body.categoria,
        usuario : req.usuario._id
    });
    
    producto.save((err, productobd) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    
        if (!productobd) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Producto no guardado'
                }
            });
        }

        res.json({
            ok: true,
            producto : productobd
        });

    });

});


app.put('/producto/:id', verificaToken, (req,res) =>{
    
    let id = req.params.id;
    let body = req.body;
    
    Producto.findByIdAndUpdate(id, body, { new: true}, (err, productodb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!productodb){
            return res.status(400).json({
                ok:false,
                err: {
                    message : 'El id no existe'
                }
            })
        }

        productodb.nombre = body.nombre;
        productodb.descripcion = body.descripcion;
        productodb.precioUni = body.precioUni;
        productodb.disponible = body.disponible;
        productodb.categoria = body.categoria;

        productodb.save( (err,productoguardado) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            
            res.json({
                ok: true,
                producto : productoguardado
            });
        });


    });
});

app.delete('/producto/:id', verificaToken, (req,res) =>{
    
    let id = req.params.id;    
    
    Producto.findByIdAndUpdate(id, {disponible:false} , { new: true}, (err, producto) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        
        if(!productodb){
            return res.status(400).json({
                ok:false,
                err: {
                    message : 'El id no existe'
                }
            })
        }


        res.json({
            ok: true,
            producto,
            message: 'Producto borrado'
        });

    });
});




module.exports = app;
