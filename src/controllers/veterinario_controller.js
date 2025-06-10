import Veterinario from "../models/Veterinario.js";
import {sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js";




const registro = async (req,res)=>{
  const {email,password} = req.body
  if (Object.values(req.body).includes("")) return res.status(400).json
  ({msg:"Todos los campos son obligatorios"})

  const veterinarioBDD = await Veterinario.findOne({email})
  if(veterinarioBDD) return res.status(400).json({msg:"El email ya esta registrado"})

    const nuevoVeterinario = new Veterinario(req.body)

    nuevoVeterinario.password= await nuevoVeterinario.encrypPassword(password)

    const token = nuevoVeterinario.crearToken()
    await sendMailToRegister(email,token)

    await nuevoVeterinario.save()


    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}



const confirmarMail = async (req,res)=>{
  
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    if(!veterinarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    veterinarioBDD.token = null
    veterinarioBDD.confirmEmail=true
    await veterinarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 

}

const recuperarPassword = async (req,res)=>{
    //1
    const {email} = req.body

    //2 
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    const veterinarioBDD = await Veterinario.findOne({email})
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    //3
    const token = veterinarioBDD.crearToken()
    veterinarioBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    // Enviar email
    await veterinarioBDD.save()
    //4
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu contraseña"})

}

const comprobarTokenPasword  = async (req,res)=>{
    //1
    const token = req.params.token
    //2
    const veterinarioBDD = await Veterinario.findOne({token})
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    //3
    await veterinarioBDD.save()
    //4
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}


const crearNuevoPassword  =async  (req,res) => {
    //1
    const{password,confirmpassword} = req.body
    //2
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})

    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    //3
    veterinarioBDD.token = null
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
    //4
    await veterinarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 

}

const login = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const veterinarioBDD = await Veterinario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    if(veterinarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await veterinarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(401).json({msg:"Lo sentimos, el password no es el correcto"})
    const {nombre,apellido,direccion,telefono,_id,rol} = veterinarioBDD
    res.status(200).json({
        rol,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:veterinarioBDD.email
    })
}






export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword,
    login
}