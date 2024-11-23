import express from 'express';

const router = express.Router();

router.get("/",function(req, res){
    res.send("Hola mundo desde Node, a través del navegador")
});
router.get("/QuienSoy",function(req, res){
    res.json({"Estudiante": "Angel de Jesus Rufino Mendoza",
        "grado":"4°",
        "grupo":"B",
        "asignatura":"Aplicaciones de Software Orientado a Servicios (AWOS)"});
    })

    export default router; //Esta palabra reservada de JS me permite exportar los elementos definidos y utilizarlos en otros dispositivos del mismo sitio
    