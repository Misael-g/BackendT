import {Router} from 'express'
import { actualizarPassword, comprobarTokenPasword, confirmarMail, recuperarPassword, registro, crearNuevoPassword, login, perfil, actualizarPerfil } from '../controllers/veterinario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'


const router =Router()


router.post('/registro',registro)
router.get('/confirmar/:token',confirmarMail) 


router.post('/recuperarpassword',recuperarPassword)
router.get('/recuperarpassword/:token', comprobarTokenPasword)
router.post('/nuevopassword/:token',crearNuevoPassword)
router.post('/login',login)

router.get('/perfil',verificarTokenJWT,perfil)
router.put('/veterinario/:id',verificarTokenJWT,actualizarPerfil)
router.put('/veterinario/actualizarpassword/:id', verificarTokenJWT, actualizarPassword);

export default router