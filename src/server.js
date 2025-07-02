import express from 'express'
import dotenv from 'dotenv' // para guardar variables privadas
import cors from 'cors'; // permite la comunicacion entre diferentes dominios 
import routerVeterinarios from './routers/veterinario_routes.js';
import routerPacientes from './routers/paciente_routes.js'

import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"

// Inicializaciones
const app = express()
dotenv.config()

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configuraciones 
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))


// Variables globales
// Rutas 

app.get('/',(req,res)=>{
    res.send("Server on")
})

//Rutas para Veterinario
app.use('/api',routerVeterinarios)

// Rutas para pacientes
app.use('/api',routerPacientes)


//Rutas para manejo rutas que no existan 
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))





// Exportar la instancia de express por medio de app
export default  app