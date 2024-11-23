import nodemailer from 'nodemailer';

const registerEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.Email_HOST,
        port: process.env.Email_PORT,
        auth: {
            user: process.env.Email_USER,
            pass: process.env.Email_PASS,
        },
    });

    const { email, name, token } = data;

    // Enviar el email
    await transport.sendMail({
        from: 'bienes_raices_230374',
        to: email,
        subject: 'Confirma tu cuenta...',
        text: `Estimado ${name}, es necesario que confirme su cuenta para poder acceder a BienesRaices_230374.`,
        html: `
            <header style="font-family: Arial, Verdana, sans-serif; text-align: center; line-height: 1.2; color: #3A3D98;">
                <h2 style="color: #2C3E50;">Bienes Raices</h2>
                <h3 style="color: #3498DB;">Confirmación de correo</h3>
            </header>
            <div style="font-family: Arial, Verdana, sans-serif; text-align: justify; line-height: 1.8; color: #2C3E50; background-color: #E8F6F3; padding: 30px; border: 8px solid #2C3E50; border-radius: 10px;">
                <h2 style="color: #3498DB;">¡Hola, <span style="color: #E74C3C;">${name}</span>!</h2>
                <div style="padding: 20px; border: dashed #3498DB; border-radius: 15px;">
                    <p style="font-size: 18px;">
                        ¡Gracias por registrarte en <strong>BienesRaices_230374</strong>! Para completar el proceso de confirmación de tu cuenta, necesitamos la confirmación de tu correo electrónico.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}" 
                           style="background-color: #3498DB; color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-size: 18px;">
                           Confirmar Cuenta
                        </a>
                    </div>
                </div>
                <p style="font-size: 16px; color: #555;">
                    Si no reconoces esta solicitud, puedes ignorar este mensaje. ¡Gracias por elegirnos!
                </p>
                <div style="text-align: center; line-height: 1.6;">
                    <p style="font-size: 18px; color: #555;">
                        Atentamente, <br>
                        <strong>Diego Salvador Tecorralco Martínez</strong>
                    </p>
                    <div style="margin-bottom: 15px;">
                        <img src="https://i.ibb.co/992pkqJ/firmateco-Photoroom.png" alt="firmateco-Photoroom"" alt="Firma" style="max-width: 150px; border-radius: 5px;">
                    </div>
                </div>
            </div>
            <footer style="text-align: center; font-size: 14px; color: #555; margin-top: 20px;">
                © 2024 BienesRaices_230374
            </footer>
        `,
    });
}

const passwordRecoveryEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.Email_HOST,
        port: process.env.Email_PORT,
        auth: {
            user: process.env.Email_USER,
            pass: process.env.Email_PASS,
        },
    });

    const { email, name, token } = data;

    // Enviar el email
    await transport.sendMail({
        from: 'bienes_raices_230374',
        to: email,
        subject: 'Restablece tu contraseña...',
        text: `Estimado ${name}, has solicitado el cambio de contraseña de tu cuenta en BienesRaices_230374.`,
        html: `
            <header style="font-family: Arial, Verdana, sans-serif; text-align: center; line-height: 1.2; color: #3A3D98;">
                <h2 style="color: #2C3E50;">Bienes Raices</h2>
                <h3 style="color: #3498DB;">Recuperación de contraseña</h3>
            </header>
            <div style="font-family: Arial, Verdana, sans-serif; text-align: justify; line-height: 1.8; color: #2C3E50; background-color: #E8F6F3; padding: 30px; border: 8px solid #2C3E50; border-radius: 10px;">
                <h2 style="color: #3498DB;">¡Hola, <span style="color: #E74C3C;">${name}</span>!</h2>
                <div style="padding: 20px; border: dashed #3498DB; border-radius: 15px;">
                    <p style="font-size: 18px;">
                        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>BienesRaices_230374</strong>.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/reset-password/${token}" 
                           style="background-color: #3498DB; color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-size: 18px;">
                           Restablecer Contraseña
                        </a>
                    </div>
                </div>
                <p style="font-size: 16px; color: #555;">
                    Si no solicitaste este cambio, puedes ignorar este mensaje. Tu cuenta seguirá siendo segura.
                </p>
                <div style="text-align: center; line-height: 1.6;">
                    <p style="font-size: 18px; color: #555;">
                        Atentamente, <br>
                        <strong>Diego Salvador Tecorralco Martínez</strong>
                    </p>
                    <div style="margin-bottom: 15px;">
                        <img src="https://i.ibb.co/992pkqJ/firmateco-Photoroom.png" alt="firmateco-Photoroom"" alt="Firma" style="max-width: 150px; border-radius: 5px;">
                    </div>
                </div>
            </div>
            <footer style="text-align: center; font-size: 14px; color: #555; margin-top: 20px;">
                © 2024 BienesRaices_230374
            </footer>
        `,
    });
}

export { registerEmail, passwordRecoveryEmail };

