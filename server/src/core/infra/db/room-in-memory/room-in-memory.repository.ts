import { RoomRepositoryInterface, Room } from '../../../domain'

export class RoomInMemoryRepository implements RoomRepositoryInterface {
  items: Array<Room> = []

  async insert(room: Room): Promise<void> {
    const roomAlreadyRegister = this.items.find((r) => r.name === room.name)
    if (roomAlreadyRegister) {
      throw new Error(`Room name already register ${room.name}`)
    }

    this.items.push(room)
  }

  async findAll(): Promise<Room[]> {
    return this.items
  }

  async findByName(roomName: string): Promise<Room> {
    const room = this.items.find((r) => r.name === roomName)
    if (room === undefined) {
      throw new Error(`Not found room with name ${roomName}`)
    }

    return room
  }

  async findAllInQueue(): Promise<Array<Room>> {
    return this.items.filter((r) => r.inQueue)
  }
}
