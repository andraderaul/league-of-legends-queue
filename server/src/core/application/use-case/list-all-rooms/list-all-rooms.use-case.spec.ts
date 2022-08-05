import crypto from 'crypto'
import { RoomInMemoryRepository } from '../../../infra/db'
import { CreateRoomUseCase } from '../create-room'
import { ListAllRoomsUseCase } from './list-all-rooms.use-case'

describe('Testing ListAllRoomsUseCase', () => {
  it('should list all rooms', async () => {
    const repository = new RoomInMemoryRepository()
    const input = {
      players: [
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ],
      owner: crypto.randomUUID(),
    }
    const createUseCase = new CreateRoomUseCase(repository)
    await createUseCase.execute({ ...input, name: 'Room X' })
    await createUseCase.execute({ ...input, name: 'Room X2' })
    await createUseCase.execute({ ...input, name: 'Room X3' })

    const listAllUseCase = new ListAllRoomsUseCase(repository)
    const [error, output] = await listAllUseCase.execute()
    expect(error).toBeNull()
    expect(output).toHaveLength(3)
    expect(output).toStrictEqual([
      {
        ...input,
        name: 'Room X',
        id: expect.any(String),
        inQueue: expect.any(Boolean),
      },
      {
        ...input,
        name: 'Room X2',
        id: expect.any(String),
        inQueue: expect.any(Boolean),
      },
      {
        ...input,
        name: 'Room X3',
        id: expect.any(String),
        inQueue: expect.any(Boolean),
      },
    ])
  })
})
