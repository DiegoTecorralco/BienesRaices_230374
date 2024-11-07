import express from 'express';

const router= express.Router();

router.get("/", function(req, res){
    res.send("Hola Mundo Desde Node, a través del navegador")
});

router.get("/QuienSoy", function(req,res){
    res.json({"estudiante": "Diego Salvador Tecorralco Martinez",
        "carrera": "TI DSM",
        "grado": "4",
        "grupo": "B",
        "asignatura": "Aplicaciones Web Orientadas a Servicios(AWOS)"
    });
})

export default router;//Esta palabra reservada de JS me permite exportar los elementos definidos y utilizarlos en otros dispositivos del mismo sitio