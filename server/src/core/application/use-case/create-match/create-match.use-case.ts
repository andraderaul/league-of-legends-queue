import { Match, MatchRepositoryInterface } from '../../../domain'

type PlayersId = Array<string>
type CreateMatchInput = {
  id: string
  playerId: string
  side: 'RED' | 'BLUE'
  winner?: 'NOT_YET_FINISHED' | 'RED_SIDE' | 'BLUE_SIDE' | 'REMAKE'
  status?: 'CHAMPION_SELECT' | 'LOADING_SCREEN' | 'IN_GAME' | 'FINISHED'
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
      const match = await this.matchRepo.findById(input.id)
      match.addPlayer(input.playerId, input.side)

      return [null, match.toJson()]
    } catch (error: any) {
      if (error?.message?.includes(input.id)) {
        const match = new Match(input, input.id)
        await this.matchRepo.insert(match)

        return [null, match.toJson()]
      }

      return [error, null]
    }
  }
}
