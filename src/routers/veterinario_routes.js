import {Router} from 'express'
import { registro } from '../controllers/veterinario_controller.js'



const router =Router()
router.post('/registro',registro) 










export default router