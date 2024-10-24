import express, { request, response } from 'express';

const router= express.Router();

//GET Se utiliza para la lectura de datos e información del servidor al cliente
//EndPoints - Son las rutas para accedes a las secciones o dunciones de nuestra aplicación web
// 2 componentes de una petición ruta, function callback (que hago)
// ":" en una ruta definen de manera posicional los parametros de entrada
router.get("/busquedaPorID", (req,res)=>{
    response.send(`Se está solicitando buscar al usuario por ID: ${reques.params.id}`)
})

//POST - Se utiliza para el envio de datos e información del cliente al servidor
router.get("/newUser/:name/:email/:password", function(req,res){
    res.send(`se ha solicitado la creación de un nuevo usuario de nombre: ${req.params.name}, asosiado al correo electronico: ${req.params.email} con la contraseña: ${req.params.password}`)
})
//PUT
router.put("/remplaceUserByEmail/:name/:email/:password", function(a,b){
    b.send(`se ha solicitado el reemplazo de tpda la informacion del usuario: ${a.params.name}, con correo: ${a.params.email} y contraseña: ${a.params.password}`)
})

//PATCH - Se utiliza para la actualizacipon parcial
router.patch("/updatePassword/:email/:newPasswordConfirm", function(req,res){
    const {email,newPassword,newPasswordConfirm}=request.params //Desestructuracion de un objeto
    if(newPassword ===newPasswordConfirm){
        response.send(`Se ha solicitado el actualización de la cintraseña del usuario con correo:${email}, se aceptan los cambios ya que la contraseña y la confirmación son la misma.`)
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }
    else{
        response.send(`Se ha solicitado el actualización de la cintraseña del usuario con correo:${email}, pero se rechaza el cambio dado que la nueva contraseña y su confirmación no coinciden.`)
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }
})
//DELETE
router.delete("/deleteUser/:email", function(req,res){
    response.send(`Se ha solicitado la eliminacion del usuario asociado al correo: ${req.params.email}`)
})

export default router;


