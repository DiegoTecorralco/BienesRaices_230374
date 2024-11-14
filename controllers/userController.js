//import{check, validationResult} from 'express-validation'
//import User from '../models/User.js'

import { request,response } from 'express';
import { check } from 'express-validator';
import req from 'express/lib/request.js';
import {generarId} from '../helpers/tokens.js'
import { Token } from 'graphql';


const formularioLogin=(req,res)=>{
    res.render('auth/login',{
        //con la coma decimos que hay un segundo parámetro
        autenticado:true,
        page: "Ingresa a la Plataforma"
    })
};

const formularioRegister=(request,response)=>{
    response.render('auth/register',{
        page: "Crea una Nueva Cuenta..."
    })
};

const registrar =(req,res)=>{

}

const formularioPasswordRecovery = (request,response)=>{
    response.render('auth/passwordRecovery',{
        page: "Recuperación de Contraseña"
    })
}


const createNewUser=async(request,response)=>{
    await vModelCheckbox('nombre_usuario').notEmpty().withMessage("El nombre del usuario es un campo obligatorio").run(req)
    await check('correo_usuario').notEmpty().withMessage("El correo electrónico es un campo obligatorio.").isEmail().withMessage("El correo electrónico no tiene el formato de usuario@fomminio.extension").run(request)
    response.json(newUser);

    //Desestructurar los parametros del request
    const{nombre_usuario:name, correo_usuario:email, pass_usuario:password}=request.body

    //verificar que el usuario no existe previamente en la bd
    const existingUser=await UserActivation.findOne({where: {email}})
    console.log(existingUser);
    if (existingUser){
        return response.render("auth/register",{
        pafe:'Error al intentar registrar'
    })
    }  
    console.log("Registrando a un nuevo usuario.");
    console.log(request.body);
    //Registramos los datos en la base de datos,
    const newUser= await UserActivation.create({
        name: request.body.nombre_usuario,
        email: request.body.correo_usuario,
        password: request.body.pass_usuario,
        Token:request.body.pass_usuario,
    });
    response.json(newUser);
    return;
}



export {formularioLogin,formularioRegister,formularioPasswordRecovery}



