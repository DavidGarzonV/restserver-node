require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//Conf Rutas
app.use(require('./routes/index'));

//habilitar carpeta public
app.use(express.static(path.resolve(__dirname,'../public')));


mongoose.connect(process.env.URLDB,(err,res) =>{
  if(err) throw err;
  console.log('Base de datos en Linea');
});
 
app.listen(process.env.PORT, () =>{
    console.log('Escuchando puerto 3000');
});