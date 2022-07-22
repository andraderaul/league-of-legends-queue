import { Room, RoomRepositoryInterface } from '../../../domain'

type CreateRoomInput = {
  name: string
  players: Array<string>
  owner?: string
  inQueue?: boolean
}

type CreateRoomOutput = {
  id: string
  name: string
  players: Array<string>
  owner?: string
  inQueue?: boolean
}

export class CreateRoomUseCase {
  constructor(private roomRepo: RoomRepositoryInterface) {}

  async execute(
    input: CreateRoomInput
  ): Promise<[Error | null, CreateRoomOutput | null]> {
    try {
      const room = new Room(input)
      await this.roomRepo.insert(room)

      return [null, room.toJson()]
    } catch (error: any) {
      return [error, null]
    }
  }
}
