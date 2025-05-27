import express from 'express'
import dotenv from 'dotenv' // para guardar variables privadas
import cors from 'cors'; // permite la comunicacion entre diferentes dominios 
import router from './routers/veterinario_routes.js';

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales


// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})


//Rutas para Veterinario
app.use('/api',router)




//Rutas para manejo rutas que no existan 
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))








// Exportar la instancia de express por medio de app
export default  app