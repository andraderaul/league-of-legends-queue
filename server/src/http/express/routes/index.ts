import { Router } from 'express'
import players from './players'
import rooms from './rooms'
import queues from './queues'
import matches from './matches'

const router = Router()

router.use('/players', players)
router.use('/rooms', rooms)
router.use('/queue', queues)
router.use('/matches', matches)

export default router
