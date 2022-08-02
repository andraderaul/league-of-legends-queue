import { Router, Request, Response } from 'express'
import {
  FindPlayerUseCase,
  StartQueueUseCase,
  StopQueueUseCase,
} from '../../../core/application'
import { playerRepo, roomRepo } from '../repository'

const queues = Router()

queues.post('/start', async (req: Request, res: Response) => {
  const startUseCase = new StartQueueUseCase(roomRepo)
  const [error, output] = await startUseCase.execute({
    name: req.body.name,
  })

  if (error) {
    return res.status(400).json({
      message: error.message,
    })
  }

  const findPlayerUseCase = new FindPlayerUseCase(playerRepo)
  const players = []
  for (const playerId of output?.players ?? []) {
    const [playerError, player] = await findPlayerUseCase.execute({
      id: playerId,
    })

    if (playerError) {
      return res.status(400).json({
        message: playerError.message,
      })
    }

    players.push(player)
  }

  res.status(200).json({ ...output, players })
})

queues.post('/stop', async (req: Request, res: Response) => {
  const stopUseCase = new StopQueueUseCase(roomRepo)
  const [error, output] = await stopUseCase.execute({
    name: req.body.name,
  })

  if (error) {
    return res.status(400).json({
      message: error.message,
    })
  }

  const findPlayerUseCase = new FindPlayerUseCase(playerRepo)
  const players = []
  for (const playerId of output?.players ?? []) {
    const [playerError, player] = await findPlayerUseCase.execute({
      id: playerId,
    })

    if (playerError) {
      return res.status(400).json({
        message: playerError.message,
      })
    }

    players.push(player)
  }

  res.status(200).json({ ...output, players })
})

export default queues
