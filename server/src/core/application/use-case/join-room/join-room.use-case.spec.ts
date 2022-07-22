import crypto from 'crypto'
import { RoomInMemoryRepository } from '../../../infra/db'
import { JoinRoomUseCase } from './join-room.use-case'
import { CreateRoomUseCase } from '../create-room'

describe('Testing JoinRoomUseCase', () => {
  it('should join in a room', async () => {
    const repository = new RoomInMemoryRepository()
    const createUseCase = new CreateRoomUseCase(repository)
    const player1 = crypto.randomUUID()
    await createUseCase.execute({
      name: 'room y',
      players: [player1],
    })

    const player2 = crypto.randomUUID()
    const input = {
      name: 'room y',
      playerId: player2,
    }
    const joinRoomUseCase = new JoinRoomUseCase(repository)
    const [error, output] = await joinRoomUseCase.execute(input)

    expect(repository.items).toHaveLength(1)
    expect(error).toBeNull()
    expect(output).toMatchObject({
      name: 'room y',
      players: [player1, player2],
      owner: player1,
    })
  })

  it('should return error when not found a room', async () => {
    const repository = new RoomInMemoryRepository()
    const joinRoomUseCase = new JoinRoomUseCase(repository)

    const player = crypto.randomUUID()
    const input = {
      name: 'room X',
      playerId: player,
    }
    const [error, output] = await joinRoomUseCase.execute(input)
    expect(output).toBeNull()
    expect(error?.message).toBe('Not found room with name room X')
  })
})
