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
        urlDb = 'mongodb://admin:admin123@ds257752.mlab.com:57752/cafe';
}

process.env.URLDB = urlDb;