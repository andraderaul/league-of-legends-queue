import crypto from 'crypto'
import { MatchInMemoryRepository } from '../../../infra/db'
import { CreateMatchUseCase } from './create-match.use-case'

describe('Testing CreateMatchUseCase', () => {
  it('should create a new match', async () => {
    const repository = new MatchInMemoryRepository()
    const createUseCase = new CreateMatchUseCase(repository)
    const input = {
      playerId: crypto.randomUUID(),
      id: crypto.randomUUID(),
    }
    const [error, output] = await createUseCase.execute({
      ...input,
      side: 'BLUE',
    })
    expect(error).toBeNull()
    expect(repository.items).toHaveLength(1)
    expect(output).toEqual({
      blueSide: [input.playerId],
      id: input.id,
      redSide: [],
      status: 'CHAMPION_SELECT',
      winner: 'NOT_YET_FINISHED',
    })
  })

  it('should be able to join in exist match', async () => {
    const repository = new MatchInMemoryRepository()
    const createUseCase = new CreateMatchUseCase(repository)
    const inputBlue = {
      playerId: crypto.randomUUID(),
      id: crypto.randomUUID(),
    }
    const [errorBlue, outputBlue] = await createUseCase.execute({
      ...inputBlue,
      side: 'BLUE',
    })

    expect(errorBlue).toBeNull()
    expect(repository.items).toHaveLength(1)
    expect(outputBlue).toEqual({
      blueSide: [inputBlue.playerId],
      id: inputBlue.id,
      redSide: [],
      status: 'CHAMPION_SELECT',
      winner: 'NOT_YET_FINISHED',
    })

    const inputRed = {
      playerId: crypto.randomUUID(),
      id: inputBlue.id,
    }

    const [errorRed, outputRed] = await createUseCase.execute({
      ...inputRed,
      side: 'RED',
    })

    expect(errorRed).toBeNull()
    expect(repository.items).toHaveLength(1)
    expect(outputRed).toEqual({
      blueSide: [inputBlue.playerId],
      id: inputBlue.id,
      redSide: [inputRed.playerId],
      status: 'CHAMPION_SELECT',
      winner: 'NOT_YET_FINISHED',
    })
  })
})
