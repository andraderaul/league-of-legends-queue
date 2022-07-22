import crypto from 'crypto'
import { PlayerInMemoryRepository } from '../../../infra/db'
import { CreatePlayerUseCase } from '../create-player'
import { FindPlayerUseCase } from './find-player'

describe('Testing FindPlayerUseCase', () => {
  it('should be able to find a player by id', async () => {
    const repository = new PlayerInMemoryRepository()
    const input = {
      name: 'player y',
      rank: 1,
    }
    const createUseCase = new CreatePlayerUseCase(repository)
    const [, player] = await createUseCase.execute(input)

    const findPlayerUseCase = new FindPlayerUseCase(repository)
    const [error, output] = await findPlayerUseCase.execute({
      id: player?.id ?? '',
    })
    expect(error).toBeNull()
    expect(output).toEqual(player)
  })

  it('should throw an error when cannot to find a player', async () => {
    const repository = new PlayerInMemoryRepository()

    const id = crypto.randomUUID()
    const findPlayerUseCase = new FindPlayerUseCase(repository)
    const [error, output] = await findPlayerUseCase.execute({
      id,
    })
    expect(error?.message).toEqual(`Not found player with id ${id}`)
    expect(output).toBeNull()
  })
})
