import { RoomRepositoryInterface } from '../../../domain'

type JoinRoomInput = {
  name: string
  playerId: string
}

type JoinRoomOutput = {
  id: string
  name: string
  players: Array<string>
  owner?: string
}

export class JoinRoomUseCase {
  constructor(private roomRepo: RoomRepositoryInterface) {}

  async execute(
    input: JoinRoomInput
  ): Promise<[Error | null, JoinRoomOutput | null]> {
    try {
      const room = await this.roomRepo.findByName(input.name)
      room.addPlayer(input.playerId)

      return [null, room.toJson()]
    } catch (error: any) {
      return [error, null]
    }
  }
}
