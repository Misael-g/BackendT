import express from 'express'
import dotenv from 'dotenv' // para guardar variables privadas
import cors from 'cors'; // permite la comunicacion entre diferentes dominios 

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

// Exportar la instancia de express por medio de app
export default  app