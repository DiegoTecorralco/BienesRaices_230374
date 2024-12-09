import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from 'bcrypt'
import { generateId } from "../helpers/tokens.js";
import {registerEmail,passwordRecoveryEmail} from '../helpers/emails.js'
import { where } from "sequelize";

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        autenticado: true,
        page: "Ingresa a la Plataforma"
    });
};

const formularioRegister = (request, response) => {
    response.render('auth/register', {
        page: "Crea una Nueva Cuenta...",
        csrfToken : request.csrfToken()
    });
};

const formularioPasswordRecovery = (request, response) => {
    response.render('auth/passwordRecovery', {
        page: "Recuperación de Contraseña",
        csrfToken : request.csrfToken()
    });
};

const createNewUser = async (req, res) => {
    // Validación de los campos que se reciben del formulario
    await check('name').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('correo_usuario')
        .notEmpty().withMessage('El correo electrónico es un campo obligatorio')
        .isEmail().withMessage('El correo electrónico no tiene el formato correcto')
        .run(req);
    await check('pass_usuario')
        .notEmpty().withMessage('La contraseña es un campo obligatorio')
        .isLength({ min: 8 }).withMessage('El Password debe ser de al menos 8 caracteres')
        .run(req);
    await check('pass2_usuario')
        .equals(req.body.pass_usuario).withMessage('La contraseña debe coincidir con la anterior')
        .run(req);

    let resultado = validationResult(req);

    // Verificamos que el resultado esté vacío
    if (!resultado.isEmpty()) {
        // Errores
        return res.render('auth/register', {
            page: 'Error al intentar crear una cuenta',
            csrfToken: req.csrfToken(),
            errors: resultado.array(),
            User:{
                name:req.body.name,
                email:req.body.correo_usuario
            }
        });
    } else {
        console.log('Registrando a un Nuevo Usuario...');
        console.log(req.body);
    }

    const { name, correo_usuario: email, pass_usuario: password } = req.body;

    // Verificamos que el usuario no existe previamente en la BD
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.render('auth/register', {
            page: 'Error al intentar crear una cuenta',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'El usuario ya está registrado' }],
            User:{
                name:req.body.name,
                email:req.body.correo_usuario
            }
        });
    }
    
    // Registramos los datos en la BD
    const newUser =await User.create({
        name,
        email,
        password, 
        token:generateId()
    });
    //Envia un email de confirmacion 
    registerEmail({
        name: newUser.name,
        email: newUser.email,
        token: newUser.token
    }) 

    
    //Mostrar mensaje de confirmación 
    res.render('templates/message',{
        page:'Cuenta Creada Correctamente',
        msg:`Hemos Enviado un Email de Confirmación a  ${email}, presione en el enlace`
    })
};
//Funcion que comprueba una cuenta 
const confirm=async (req,res)=>{

    const {token}=req.params;
    //Verificamos si el token es valido
    const user= await User.findOne({where:{token}})
    if(!user){
        return res.render('auth/confirmAccount',{
            page:'Error al confirmar tu cuenta...',
            msg:'Hubo un error al confirmar tu cuenta, intenta de nuevo..',
            error:true
        })
    }

    // Confirmar Cuenta
    user.token=null;
    user.confirmed=true;
    await user.save();
    res.render('auth/confirmAccount',{
        page:'Cuenta Confirmada',
        msg:'La cuenta se ha confirmado Correctamente ',
        error:false
    })
}
const resetPassword = async (req, res) => {
    await check('correo_usuario')
        .notEmpty().withMessage('El correo electrónico es un campo obligatorio')
        .isEmail().withMessage('El correo electrónico no tiene el formato correcto')
        .run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errors: resultado.array()
        });
    }

    const { correo_usuario } = req.body;

    // Buscar el usuario
    const user = await User.findOne({ where: { email: correo_usuario } });
    if(!user){
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errors: [{msg:'UPSSS, El Correo no Pertenece a ningún usuario'}]
        });
    }
    //Generar un token y enviar un email
    user.token=generateId();
    await user.save();

    //Enviar un Email
    passwordRecoveryEmail({
        email: user.email,
        name: user.name,
        token: user.token

    })
    //Renderizar un mensaje 
    res.render('templates/message',{
        page:'Restablece tu Contraseña',
        msg:`Hemos Enviado un Email con las instrucciones para Reestablecer su contraseña`
    })

};


const checkToken = async(req,res)=>{
    const { token } =req.params;
    const user=await User.findOne({where: {token}})
    if(!user){
        return res.render('auth/confirmAccount',{
            page:'Restablece tu Contraseña...',
            msg:'Hubo un error al validar tu información , intenta de nuevo..',
            error:true
        })
    }

    //Formulario para modificar el password
    res.render('auth/reset-password',{
        page: 'Restablece tu Contraseña',
        csrfToken: req.csrfToken()

    })



}
const newPassword= async(req,res)=>{
    //Validar el password
    await check('new_password')
        .notEmpty().withMessage('La contraseña es un campo obligatorio')
        .isLength({ min: 8 }).withMessage('El Password debe ser de al menos 8 caracteres')
        .run(req);
    await check('new_password2')
        .equals(req.body.new_password).withMessage('La contraseña debe coincidir con la anterior')
        .run(req);

    let resultado = validationResult(req);
    // Verificamos que el resultado esté vacío
    if (!resultado.isEmpty()) {
        // Errores
        return res.render('auth/register', {
            page: 'Reestablece tu Contraseña',
            csrfToken: req.csrfToken(),
            errors: resultado.array()
        });
    }
    const { token }=req.params
    const {new_password}=req.body
    //Identificar quien hace el cambio
    const user =await User.findOne({where:{token}})

    //  Hashear el nuevo password
    const salt= await bcrypt.genSalt(10)
    user.password=await bcrypt.hash(new_password,salt);
    user.token=null;

    await user.save();

    res.render('auth/confirmAccount',{
        page: 'Password Reestablecido',
        msg:'El password se Guardó correctamente '
    })
}


export {
    formularioLogin,
    formularioRegister,
    formularioPasswordRecovery,
    createNewUser,
    confirm,
    checkToken,
    newPassword,
    resetPassword
};
