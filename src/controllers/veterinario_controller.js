import Veterinario from "../models/Veterinario.js";
import sendMailToRegister from "../config/nodemailer.js";




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



export {
    registro,
    confirmarMail
}