import { Match, MatchRepositoryInterface } from '../../../domain'

type PlayersId = Array<string>
type CreateMatchInput = {
  winner?: 'NOT_YET_FINISHED' | 'RED_SIDE' | 'BLUE_SIDE' | 'REMAKE'
  status?: 'CHAMPION_SELECT' | 'LOADING_SCREEN' | 'IN_GAME' | 'FINISHED'
  blueSide: PlayersId
  redSide: PlayersId
}

type CreateMatchOutput = {
  id: string
  winner?: 'NOT_YET_FINISHED' | 'RED_SIDE' | 'BLUE_SIDE' | 'REMAKE'
  status?: 'CHAMPION_SELECT' | 'LOADING_SCREEN' | 'IN_GAME' | 'FINISHED'
  blueSide: PlayersId
  redSide: PlayersId
}

export class CreateMatchUseCase {
  constructor(private matchRepo: MatchRepositoryInterface) {}

  async execute(
    input: CreateMatchInput
  ): Promise<[Error | null, CreateMatchOutput | null]> {
    try {
      const match = new Match(input)
      await this.matchRepo.insert(match)

      return [null, match.toJson()]
    } catch (error: any) {
      return [error, null]
    }
  }
}
