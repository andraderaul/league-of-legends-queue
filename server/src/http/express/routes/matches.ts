import { Router, Request, Response } from 'express'
import { CreateMatchUseCase, StopQueueUseCase } from '../../../core/application'
import { matchRepo, roomRepo } from '../repository'

const matches = Router()

/** TODO: need to improve, under construction */
matches.post('/', async (req: Request, res: Response) => {
  const stopUseCase = new StopQueueUseCase(roomRepo)
  const createUseCase = new CreateMatchUseCase(matchRepo)
  const [error, output] = await createUseCase.execute(req.body.sides)

  if (error) {
    return res.status(400).json({
      message: error?.message,
    })
  }
  const [stopError, stopOutput] = await stopUseCase.execute(req.body.name)

  if (stopOutput) {
    return res.status(400).json({
      message: stopError?.message,
    })
  }

  res.status(201).json(output)
})

export default matches
