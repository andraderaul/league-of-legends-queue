import { Router, Request, Response } from 'express'
import {
  CreateRoomUseCase,
  FindPlayerUseCase,
  JoinRoomUseCase,
  ListAllRoomsUseCase,
} from '../../../core/application'
import { playerRepo, roomRepo } from '../repository'
import { io } from '..'

const rooms = Router()

rooms.get('/', async (_req: Request, res: Response) => {
  const listAllUseCase = new ListAllRoomsUseCase(roomRepo)
  const [error, output] = await listAllUseCase.execute()

  if (error) {
    return res.status(400).json({
      message: error.message,
    })
  }

  return res.json(output)
})

rooms.post('/', async (req: Request, res: Response) => {
  const findPlayerUseCase = new FindPlayerUseCase(playerRepo)
  const players = []
  for (const playerId of req.body?.players ?? []) {
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

  const createUseCase = new CreateRoomUseCase(roomRepo)
  const [error, output] = await createUseCase.execute(req.body)

  if (error) {
    return res.status(400).json({
      message: error.message,
    })
  }

  const result = { ...output, players }

  io.emit(`rooms-${output?.name}`, result)
  res.status(201).json(result)
})

rooms.post('/:id/join', async (req: Request, res: Response) => {
  const id = req.params?.id

  const findPlayerUseCase = new FindPlayerUseCase(playerRepo)

  const [pError] = await findPlayerUseCase.execute({
    id: req.body?.playerId,
  })

  if (pError) {
    return res.status(400).json({
      message: pError.message,
    })
  }

  const joinUseCase = new JoinRoomUseCase(roomRepo)
  const [error, output] = await joinUseCase.execute({
    name: id,
    playerId: req.body.playerId,
  })

  if (error) {
    return res.status(400).json({
      message: error.message,
    })
  }

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

  const result = { ...output, players }

  io.emit(`rooms-${output?.name}`, result)
  res.status(200).json(result)
})

export default rooms
