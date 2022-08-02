import { Router, Request, Response } from 'express'
import {
  CreatePlayerUseCase,
  ListAllPlayersUseCase,
} from '../../../core/application'
import { playerRepo } from '../repository'

const players = Router()

players.get('/', async (_req: Request, res: Response) => {
  const listAllUseCase = new ListAllPlayersUseCase(playerRepo)
  const [error, output] = await listAllUseCase.execute()

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  res.json(output)
})

players.post('/', async (req: Request, res: Response) => {
  const createUseCase = new CreatePlayerUseCase(playerRepo)
  const [error, output] = await createUseCase.execute(req.body)

  if (error) {
    return res.status(400).json({
      message: error.message,
    })
  }

  res.status(201).json(output)
})

export default players
