import express from 'express';

//const express =  require(`express`);//importar la libreria para crear para crear un nuevo servidor web

//Ibstanciar nuestra aplicacion web
const app= express()

//configuramos nuestro servidor web
const port =3000;
app.listen(port, ()=>{
    console.log(`La aplicacion ha iniciado en el puerto: ${port}`)
})

//probamos las rutas para pider presentar mensajes al usuario a traves dekl navegador
app.get("/", function(req,res){
    res.send("Hola mundo desde node, a traves del navegador")
})

app.get("/QuienSoy", function(req,res){
    res.json({"estudiante": "Diego Salvador Tecorralco Martinez",
        "carrera": "TI DSM",
        "grado": "4",
        "grupo": "B",
        "asignatura": "Aplicaciones Web Orientadas a Servicios(AWOS)"
    });
})
