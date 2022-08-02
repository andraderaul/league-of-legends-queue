import { Router, Request, Response } from 'express'
import { io, socketIds } from '..'
import {
  CreateMatchUseCase,
  FindPlayerUseCase,
  StopQueueUseCase,
} from '../../../core/application'
import { matchRepo, roomRepo, playerRepo } from '../repository'

const matches = Router()

matches.post('/', async (req: Request, res: Response) => {
  const stopUseCase = new StopQueueUseCase(roomRepo)
  const createUseCase = new CreateMatchUseCase(matchRepo)

  const [error, output] = await createUseCase.execute({
    id: req.body?.matchId,
    playerId: req.body?.playerId,
    side: req.body?.side,
  })

  if (error) {
    return res.status(400).json({
      message: error?.message,
    })
  }

  const [stopError] = await stopUseCase.execute({
    name: req.body.roomName,
  })

  if (stopError) {
    return res.status(400).json({
      message: stopError?.message,
    })
  }

  const findPlayerUseCase = new FindPlayerUseCase(playerRepo)
  const blueSide: any = []
  const redSide: any = []

  for (const pId of output?.blueSide ?? []) {
    const [, player] = await findPlayerUseCase.execute({ id: pId })
    blueSide.push(player)
  }

  for (const pId of output?.redSide ?? []) {
    const [, player] = await findPlayerUseCase.execute({ id: pId })
    redSide.push(player)
  }

  output?.blueSide.forEach((player) => {
    const socketId = socketIds.get(player) || ''
    io.to(socketId).emit('accept-match', { ...output, blueSide, redSide })
  })

  output?.redSide.forEach((player) => {
    const socketId = socketIds.get(player) || ''
    io.to(socketId).emit('accept-match', { ...output, redSide, blueSide })
  })

  res.status(201).json(output)
})

export default matches
