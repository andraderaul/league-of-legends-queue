import { Room } from "./room.entity";

export interface RoomRepositoryInterface {
  insert(room: Room): Promise<void>;
  findAll(): Promise<Array<Room>>;
  findByName(roomName: string): Promise<Room>;
  findAllInQueue(): Promise<Array<Room>>;
}
