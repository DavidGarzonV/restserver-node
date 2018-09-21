const express = require('express');
let  {verificaToken,verificaAdmin } =  require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();

let Categoria = require('../models/categoria');


//todas las categorias
app.get('/categoria', verificaToken,(req,res) =>{
    
    Categoria.find({})
    //elemento al que hacemos referencia de la otra coleccion, object id
    .populate('usuario','nombre email')
    .sort('descripcion')
    .exec( (err,categorias) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok:true,
            categorias
        })
   });    
});

//mostrar una categoria por id
app.get('/categoria/:id', verificaToken,(req,res) =>{
    
    
    let id = req.params.id;

    Categoria.findById(id)
    .exec( (err,categoria) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok:true,
            categoria
        })
   });    
});

// Crear nueva categoria
app.post('/categoria', verificaToken, (req,res) =>{
    
    let body = req.body;
    
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario : req.usuario._id
    });

    
    categoria.save((err, categoriabd) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        
        if (!categoriabd) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            categoria : categoriabd
        });

    });

});

//actualizar descripcion categoria
app.put('/categoria/:id', verificaToken, (req,res) =>{
    
    let id = req.params.id;
    let body = _.pick(req.body,['descripcion']);

    //NEW DEVUELVE EL OBJETO ACTUALIZADO Y NO EL ORIGINAL
    //RUN VALIDATORS EJECUTA VALIDACIONES DEFINIDAS EN ESQUEMMA  
    Categoria.findByIdAndUpdate(id, body, { new: true}, (err, categoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });

    });
});


//borrar categoria
//solo un administrador puede borrar categorias
//pedir token, eliminar fisicamente.
app.delete('/categoria/:id', [verificaToken,verificaAdmin], (req,res) =>{
    let id = req.params.id;
    
    Categoria.findByIdAndRemove(id,(err, categoriaBorrada)=>{

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaBorrada){
            return res.status(400).json({
                ok: false,
                err : {
                    message :"Categoria no encontrado"
                }
            });
        }

        res.json({
            ok:true,
            categoria : categoriaBorrada
        })

    });
});

module.exports = app;