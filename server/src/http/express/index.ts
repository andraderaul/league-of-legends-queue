import 'dotenv/config'
import express, { Express } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { ListAllRoomsUseCase, FindMatchUseCase } from '../../core/application'

import { playerRepo, roomRepo } from './repository'
import router from './routes'

const port = process.env.PORT || 3001
const corsOptions = {
  origin: [<string>process.env.CLIENT_URL],
}

const app: Express = express()
const httpServer = createServer(app)
export const io = new Server(httpServer, {
  cors: {
    ...corsOptions,
  },
})

/* change this for redis on future */
const socketIds = new Map<string, string>()

app.use(express.json())
app.use(cors(corsOptions))
app.use(router)

io.on('connection', (socket) => {
  console.log('Client Connected')
  console.log(socketIds)

  socket.on('check-in', (userId) => {
    socketIds.set(userId, socket.id)
    io.emit('active-players', socketIds.size)

    console.log(socketIds)
  })

  socket.on('on-queue', (data) => {
    console.log('on-queue', data)
  })
})

/* maybe change this in the future */
// setInterval(findAMatch, 3000)
async function findAMatch() {
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
}

httpServer.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
