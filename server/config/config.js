// =================================
// Puerto
// =================================
//Puerto definido para la aplicacion, sino está, se usa el 3000

process.env.PORT = process.env.PORT || 3000;

// =================================
// Entorno
// =================================

//Verifica si esta en entorno local o desde un servidor
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =================================
// Base de datos
// =================================

let urlDb;

if(process.env.NODE_ENV==='dev'){
        urlDb = 'mongodb://localhost:27017/cafe';
}else{
        urlDb = process.env.MONGO_URL;
}

process.env.URLDB = urlDb;


// =================================
// Vencimiento del TOKEN
// =================================
//60 segundos
//60 minutos
//24 horas 
//30 dias
process.env.caducidad_token = 60 * 60 * 24 * 30;


// =================================
// SEDD de autenticacion
// =================================

process.env.seed = process.env.seed || 'este-es-el-seed';


// =================================
// Google client id
// =================================


process.env.CLIENT_ID = process.env.CLIENT_ID || '721453234653-hmqr702ade4h5sa6s0gsvqe1ugq7d2tl.apps.googleusercontent.com';