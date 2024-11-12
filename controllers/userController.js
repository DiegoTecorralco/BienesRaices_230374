//import{check, validationResult} from 'express-validation'
//import User from '../models/User.js'

import { request,response } from 'express';
import { check } from 'express-validator';
import req from 'express/lib/request.js';


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
}

export {formularioLogin,formularioRegister,formularioPasswordRecovery}



