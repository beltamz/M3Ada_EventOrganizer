import {Router} from 'express'

import{//nombre de cada controlador
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/events-controllers'

import {validateEvent} from '../middlewares/validate-middleware'

const router: Router = Router();

router.get('/',getAllEvents)
router.post('/',validateEvent,createEvent)
router.patch('/:id',updateEvent)
router.delete('/:id',deleteEvent)

export default router