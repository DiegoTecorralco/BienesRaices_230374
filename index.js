//ECMA Sript 6
// commin JS

import express from 'express';
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './db/config.js';
import csrf from 'csurf'
import cookieParser from 'cookie-parser';

//const express = require('express'); //DECLARANDO UN OBJETO QUE VA A PERMITIR LEER PAGINAS ETC.importar la libreria para crear un servidor web

//INSTANCIAR NUESTRA APLICACIÓN WEB
//conexion a la Base de Datos
try{
  await db.authenticate(); //verifico las credenciales del usuario 
  db.sync();
  console.log('Conexion Correcta a la Base DE Datos')
}catch(error){
  console.log(error)
}


const app = express();
//Definir la carpeta pública de recursos estáticos (assets)
app.use(express.static('./public'));

//Habilitar la lectura de datos desde formularios
app.use(express.urlencoded({encoded:true}));

//Habilitar Cookie Parser
app.use(cookieParser())

//Habilitar CSRF
app.use(csrf({cookie:true}))

//Routing - Enrutamiento
app.use('/',generalRoutes);
app.use('/auth/', userRoutes);
//Probamos rutas para poder presentar mensajes al usuario a través del navegador


//Habilitar pug
//Set es para hacer configuraciones
app.set('view engine','pug')
app.set('views','./views')//se define donde tendrá el proyecto las vistas
//auth -> auntentificación

//CONFIGURAMOS NUESTRO SERVIDOR WEB (puerto donde estara escuchando nuestro sitio web)
const port = process.env.PORT ||3000;
app.listen(port, () => {
  console.log(`La aplicación ha iniciado en el puerto: ${port}`);  
});
