import 'dotenv/config'
import express, { Express } from 'express'
import { createServer } from 'http'
import cors from 'cors'
import router from './routes'
import { Server } from 'socket.io'
import { playerRepo, roomRepo } from './repository'
import { FindMatchUseCase, ListAllRoomsUseCase } from '../../core/application'

const port = process.env.PORT || 3001
const app: Express = express()
const httpServer = createServer(app)

const corsOptions = {
  origin: [<string>process.env.CLIENT_URL],
}

export const io = new Server(httpServer, {
  cors: {
    ...corsOptions,
  },
})

app.use(express.json())
app.use(cors(corsOptions))
app.use(router)

/* change this for redis on future */
export const socketIds = new Map<string, string>()

io.on('connection', (socket) => {
  console.log('\n->👩‍💻 Client Connected <-\n')
  console.log('\n->🤾 Players connected<-\n', socketIds)

  socket.on('check-in', (userId) => {
    socketIds.set(userId, socket.id)
    io.emit('active-players', socketIds.size)

    console.log(socketIds)
  })

  socket.on('start-queue', () => {
    console.log('start-queue')

    matchmaking()
  })

  socket.on('stop-queue', () => {
    console.log('stop-queue')

    matchmaking()
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id)

    socketIds.delete(socket.id)
  })
})

/* maybe change this in the future */
async function matchmaking() {
  const listAllRooms = new ListAllRoomsUseCase(roomRepo)
  const [_, rooms] = await listAllRooms.execute()
  console.log('\n###ROOMS###')
  console.log(JSON.stringify({ rooms }, null, 2))
  console.log('###########\n')

  const matchUseCase = new FindMatchUseCase(roomRepo, playerRepo)
  const [error, output] = await matchUseCase.execute()

  console.log('\n###MATCH###')
  console.log({ message: error?.message })
  console.log('###########\n')
  console.log(JSON.stringify({ match: output }, null, 2))
  if (output?.blueSide !== undefined && output?.redSide !== undefined) {
    output.blueSide.forEach((player) => {
      const socketId = socketIds.get(player.id) || ''
      io.to(socketId).emit('match', { ...output, side: 'BLUE' })
    })

    output.redSide.forEach((player) => {
      const socketId = socketIds.get(player.id) || ''
      io.to(socketId).emit('match', { ...output, side: 'RED' })
    })
  }
}

httpServer.listen(port, () => {
  console.log(`🚀 Listening on port: ${port} 🚀`)
})
