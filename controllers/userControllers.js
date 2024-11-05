const formularoLogin =(request,response) =>{
    response.render("auth/login",{
    auntenticado: false
    })
}

const formularioRegister = (request,response) =>{
    response.render("auth/registrer",{

    })
}

const formularioPasswordRecovery = (request,response) =>{
    response.render("auth/passwordRecovery",{

    })
}

export{formularoLogin,formularioRegister,formularioPasswordRecovery}