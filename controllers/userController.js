import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { generateId, generarJWT } from "../helpers/tokens.js";
import moment from "moment";
import { registerEmail, passwordRecoveryEmail } from '../helpers/emails.js';

// Mostrar formulario de login
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        autenticado: true,
        page: "Ingresa a la Plataforma",
        csrfToken: req.csrfToken(),
    });
};
const formularioPasswordRecovery = (request, response) => {
    response.render('auth/passwordRecovery', {
        page: "Recuperación de Contraseña",
        csrfToken : request.csrfToken()
    });
};
// Autenticar usuario
const authenticate = async (req, res) => {
    // Validación de campos
    await check('correo_usuario')
        .notEmpty().withMessage('El correo electrónico es un campo obligatorio')
        .isEmail().withMessage('Debe ser un correo válido')
        .run(req);
    await check('pass_usuario')
        .notEmpty().withMessage('La contraseña es un campo obligatorio')
        .run(req);

    const resultado = validationResult(req);

    // Validar errores en los campos
    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            page: 'Error al intentar iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: resultado.array(),
        });
    }

    const { correo_usuario: email, pass_usuario: password } = req.body;

    try {
        // Verificar si el usuario existe en la base de datos
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render('auth/login', {
                page: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errors: [{ msg: 'El Usuario No Existe' }],
            });
        }

        // Verificar si el usuario está confirmado
        if (!user.confirmed) {
            return res.render('auth/login', {
                page: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errors: [{ msg: 'Tu Cuenta no ha sido Confirmada' }],
            });
        }

        // Revisar el password
        if (!user.verificarPassword(password)) {
            return res.render('auth/login', {
                page: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errors: [{ msg: 'La Contraseña es Incorrecta' }],
            });
        }

        // Generar el token JWT
        const token = generarJWT({ id: user.id, nombre: user.name });

        // Almacenar el token en una cookie
        return res.cookie('_token', token, {
            httpOnly: true,
        }).redirect('/properties/myProperties');
    } catch (error) {
        console.error(error);
        return res.status(500).render('auth/login', {
            page: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'Ocurrió un error inesperado. Intenta de nuevo.' }],
        });
    }
};

// Mostrar formulario de registro
const formularioRegister = (request, response) => {
    response.render('auth/register', {
        page: "Crea una Nueva Cuenta...",
        csrfToken: request.csrfToken(),
    });
};

// Registrar nuevo usuario
const createNewUser = async (req, res) => {
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

    // Validación de la fecha de nacimiento
    await check('fecha_nacimiento')
        .notEmpty().withMessage('La fecha de nacimiento es obligatoria')
        .custom((value) => {
            const age = moment().diff(moment(value, 'YYYY-MM-DD'), 'years');
            if (age < 18) {
                throw new Error('Debes ser mayor de 18 años para registrarte');
            }
            return true;
        })
        .run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/register', {
            page: 'Error al intentar crear una cuenta',
            csrfToken: req.csrfToken(),
            errors: resultado.array(),
            User: {
                name: req.body.name,
                email: req.body.correo_usuario,
            },
        });
    }

    const { name, correo_usuario: email, pass_usuario: password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.render('auth/register', {
            page: 'Error al intentar crear una cuenta',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'El usuario ya está registrado' }],
            User: {
                name: req.body.name,
                email: req.body.correo_usuario,
            },
        });
    }

    // Crear nuevo usuario
    const newUser = await User.create({
        name,
        email,
        password,
        token: generateId(),
    });

    // Enviar email de confirmación
    registerEmail({
        name: newUser.name,
        email: newUser.email,
        token: newUser.token,
    });

    // Mostrar mensaje de confirmación
    res.render('templates/message', {
        page: 'Cuenta Creada Correctamente',
        msg: `Hemos Enviado un Email de Confirmación a ${email}, presiona en el enlace.`,
    });
};

// Confirmar cuenta
const confirm = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ where: { token } });

    if (!user) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu cuenta...',
            msg: 'Hubo un error al confirmar tu cuenta, intenta de nuevo.',
            error: true,
        });
    }

    user.token = null;
    user.confirmed = true;
    await user.save();

    res.render('auth/confirmAccount', {
        page: 'Cuenta Confirmada',
        msg: 'La cuenta se ha confirmado correctamente.',
        error: false,
    });
};
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
            errors: resultado.array(),
        });
    }

    const { correo_usuario } = req.body;

    // Buscar el usuario
    const user = await User.findOne({ where: { email: correo_usuario } });

    if (!user || !user.confirmed) {
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'El correo no pertenece a un usuario confirmado.' }],
        });
    }

    console.log("El Usuario si existe en la BD y está confirmado");
    //Campo de la contraseña vacio
    user.password = "";
    // Generar un token y enviar un email
    user.token = generateId();
    await user.save();

    // Enviar un Email
    passwordRecoveryEmail({
        email: user.email,
        name: user.name,
        token: user.token,
    });

    // Renderizar un mensaje
    res.render('templates/message', {
        page: 'Restablece tu Contraseña',
        msg: `Hemos Enviado un Email a ${correo_usuario} con las instrucciones para Reestablecer su contraseña`,
    });
};

const checkToken = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ where: { token } });

    if (!user || !user.confirmed) {
        return res.render('auth/confirmAccount', {
            page: 'Restablece tu Contraseña...',
            msg: 'Hubo un error al validar tu información. Verifica que tu cuenta esté confirmada.',
            error: true,
        });
    }

    // Formulario para modificar el password
    res.render('auth/reset-password', {
        page: 'Restablece tu Contraseña',
        csrfToken: req.csrfToken(),
    });
};


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
        return res.render('auth/reset-password', {
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
    authenticate,
    formularioRegister,
    formularioPasswordRecovery,
    createNewUser,
    confirm,
    checkToken,
    newPassword,
    resetPassword
};