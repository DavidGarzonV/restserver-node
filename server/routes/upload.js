const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


//default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['productos','usuarios'];

    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err: {
                message:'Los tipos permitidos son ' + tiposValidos.join(', '),
                tipo
            }
        });
    }


    let file = req.files.archivo;
    let nombreCortado = file.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];

    //Extensiones permitidas
    let extensionesValidas = ['png','PNG','jpg','JPG','jpeg','JPEG','gif'];

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            err: {
                message:'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //cambiar nombre archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`

    file.mv(`uploads/${tipo}/${nombreArchivo}`, (err) =>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(tipo==='usuarios'){                    
            //Actualizar imagen del usuario
            imagenUsuario(id,res,nombreArchivo);
        }else{
            imagenProducto(id,res,nombreArchivo);
        }

    });
});



function imagenUsuario(id,res,nombreArchivo){

    Usuario.findById(id, (err,usuarioDB) =>{

        if(err){
            borraArchivo('usuarios',nombreArchivo); 
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB){
            borraArchivo('usuarios',nombreArchivo); 
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El usuario no existe'
                }
            })
        }

        //verificar que imagen exista para el usuario
        borraArchivo('usuarios',usuarioDB.img);

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err,usuarioGuardado) =>{
           res.json({
               ok:true,
               usuario:usuarioGuardado,
               img :nombreArchivo
           })
        });


    });
}


function imagenProducto(id,res,nombreArchivo){
    Producto.findById(id, (err,productoDB) =>{

        if(err){
            borraArchivo('productos',nombreArchivo); 
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB){
            borraArchivo('productos',nombreArchivo); 
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El producto no existe'
                }
            })
        }

        //verificar que imagen exista para el usuario
        borraArchivo('productos',productoDB.img);

        productoDB.img = nombreArchivo;
        productoDB.save((err,productoGuardado) =>{
           res.json({
               ok:true,
               producto:productoGuardado,
               img :nombreArchivo
           })
        });


    });
}


function borraArchivo(tipo,nombreArchivo){
    let pathArchivo = path.resolve(__dirname,`../../uploads/${tipo}/${nombreArchivo}`);
    if(fs.existsSync(pathArchivo)){
        fs.unlinkSync(pathArchivo);
    } 
}
module.exports = app;