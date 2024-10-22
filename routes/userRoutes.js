import express, { response } from 'express';

const router= express.Router();

//GET
router.get("/busquedaPorID", (req,res)=>{
    response.send(`Se está solicitando buscar al usuario por ID: ${reques.params.id}`)
})// 2 componentes de una petición ruta, function callback

//POST

//PUT


//PATCH

export default router


