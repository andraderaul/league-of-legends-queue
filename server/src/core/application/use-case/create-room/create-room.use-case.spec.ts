import crypto from 'crypto'
import { RoomInMemoryRepository } from '../../../infra/db'
import { CreateRoomUseCase } from './create-room.use-case'

describe('Testing CreateRoomUseCase', () => {
  it('should create a new room', async () => {
    const repository = new RoomInMemoryRepository()
    const createUseCase = new CreateRoomUseCase(repository)
    const player = crypto.randomUUID()
    const input = {
      name: 'room y',
      players: [player],
    }

    const [error, output] = await createUseCase.execute(input)

    expect(repository.items).toHaveLength(1)
    expect(error).toBeNull()
    expect(output).toMatchObject(input)
  })

  it('should receive error when are more than five players in a room', async () => {
    const repository = new RoomInMemoryRepository()
    const createUseCase = new CreateRoomUseCase(repository)

    const input = {
      name: 'room y',
      players: [
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ],
    }
    const [error, output] = await createUseCase.execute(input)
    expect(error?.message).toBe('Max players per room is five and was passed 7')
    expect(output).toBeNull()
  })
})
