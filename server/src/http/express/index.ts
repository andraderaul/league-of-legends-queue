import 'dotenv/config'
import express, { Express, Request, Response } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import {
  RoomInMemoryRepository,
  PlayerInMemoryRepository,
  MatchInMemoryRepository,
} from '../../core/infra/db'
import {
  ListAllPlayersUseCase,
  CreatePlayerUseCase,
  CreateRoomUseCase,
  ListAllRoomsUseCase,
  JoinRoomUseCase,
  StartQueueUseCase,
  StopQueueUseCase,
  FindMatchUseCase,
  CreateMatchUseCase,
  FindPlayerUseCase,
} from '../../core/application'

const port = process.env.PORT || 3001
const corsOptions = {
  origin: [<string>process.env.CLIENT_URL],
}

const app: Express = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    ...corsOptions,
  },
})

/* change this for redis on future */
const socketIds = new Map<string, string>()

app.use(express.json())
app.use(cors(corsOptions))

io.on('connection', (socket) => {
  console.log('Client Connected')
  console.log(socketIds)

  socket.on('check-in', (userId) => {
    socketIds.set(userId, socket.id)
    io.emit('active-players', socketIds.size)

    console.log(socketIds)
  })
})

const roomRepo = new RoomInMemoryRepository()
const playerRepo = new PlayerInMemoryRepository()
const matchRepo = new MatchInMemoryRepository()

app.get('/players', async (_req: Request, res: Response) => {
  const listAllUseCase = new ListAllPlayersUseCase(playerRepo)
  const [error, output] = await listAllUseCase.execute()

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  res.json(output)
})

app.post('/players', async (req: Request, res: Response) => {
  const createUseCase = new CreatePlayerUseCase(playerRepo)
  const [error, output] = await createUseCase.execute(req.body)

  if (error) {
    return res.status(400).json({
      message: error.message,
    })
  }

  res.status(201).json(output)
})

app.get('/rooms', async (_req: Request, res: Response) => {
  const listAllUseCase = new ListAllRoomsUseCase(roomRepo)
  const [error, output] = await listAllUseCase.execute()

  if (error) {
    return res.status(400).json({
      message: error.message,
    })
  }

  return res.json(output)
})

app.post('/rooms', async (req: Request, res: Response) => {
  const createUseCase = new CreateRoomUseCase(roomRepo)
  const [error, output] = await createUseCase.execute(req.body)

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

  const result = { ...output, players }

  io.emit(`rooms-${output?.name}`, result)
  res.status(201).json(result)
})

app.post('/rooms/:id/join', async (req: Request, res: Response) => {
  const id = req.params?.id

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

  const result = { ...output, players }

  io.emit(`rooms-${output?.name}`, result)
  res.status(200).json(result)
})

app.post('/queue/start', async (req: Request, res: Response) => {
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

app.post('/queue/stop', async (req: Request, res: Response) => {
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

/** TODO: need to improve */
app.post('/matches', async (req: Request, res: Response) => {
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

/* maybe change this in the future */
setInterval(async () => {
  const listAllRooms = new ListAllRoomsUseCase(roomRepo)
  const [_, rooms] = await listAllRooms.execute()
  console.log(JSON.stringify({ rooms }, null, 2))

  const matchUseCase = new FindMatchUseCase(roomRepo, playerRepo)
  const [error, output] = await matchUseCase.execute()

  console.log({ message: error?.message })
  console.log(JSON.stringify({ match: output }, null, 2))
  if (output?.blueSide !== undefined && output?.redSide !== undefined) {
    output.blueSide.forEach((player) => {
      const socketId = socketIds.get(player.id) || ''
      io.to(socketId).emit('match', output)
    })

    output.redSide.forEach((player) => {
      const socketId = socketIds.get(player.id) || ''
      io.to(socketId).emit('match', output)
    })
  }
}, 3000)

httpServer.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
