import { PlayerInMemoryRepository } from '../../../infra/db'
import { CreatePlayerUseCase } from '../create-player'
import { ListAllPlayersUseCase } from './list-all-players.use-case'

describe('Testing ListAllPlayerUseCase', () => {
  it('should list all players', async () => {
    const repository = new PlayerInMemoryRepository()
    const input1 = {
      name: 'player x',
      rank: 1,
    }
    const input2 = {
      name: 'player y',
      rank: 1,
    }
    const input3 = {
      name: 'player z',
      rank: 1,
    }
    const createUseCase = new CreatePlayerUseCase(repository)
    await createUseCase.execute(input1)
    await createUseCase.execute(input2)
    await createUseCase.execute(input3)

    const listAllUseCase = new ListAllPlayersUseCase(repository)
    const [error, output] = await listAllUseCase.execute()
    expect(error).toBeNull()
    expect(output).toHaveLength(3)
    expect(output).toStrictEqual([
      {
        ...input1,
        id: expect.any(String),
      },
      {
        ...input2,
        id: expect.any(String),
      },
      {
        ...input3,
        id: expect.any(String),
      },
    ])
  })
})
