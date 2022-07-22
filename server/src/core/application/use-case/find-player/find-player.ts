import { PlayerRepositoryInterface } from '../../../domain'

type FindPlayerInput = {
  id: string
}

type FindPlayerOutput = {
  id: string
  name: string
  rank: number
}

export class FindPlayerUseCase {
  constructor(private playerRepo: PlayerRepositoryInterface) {}

  async execute(
    input: FindPlayerInput
  ): Promise<[Error | null, FindPlayerOutput | null]> {
    try {
      const player = await this.playerRepo.findById(input.id)

      return [null, player.toJson()]
    } catch (error: any) {
      return [error, null]
    }
  }
}
