import {Router} from 'express'
import { registrarPaciente,listarPacientes } from '../controllers/paciente_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()


router.post("/paciente/registro",verificarTokenJWT, registrarPaciente)
router.get("/pacientes",verificarTokenJWT,listarPacientes)



export default router