import { Router } from 'express'
import { //importo cada controlador
    registerUser,
    loginUser, 
    getProfile 
} from '../controllers/auth-controllers'

import { autenticacionToken } from '../middlewares/auth-middleware'

const router: Router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', autenticacionToken, getProfile)

export default router