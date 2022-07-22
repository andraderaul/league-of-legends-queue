import { RoomRepositoryInterface } from "../../../domain";

type FindAllPlayerOutput = Array<{
  id: string;
  name: string;
  players: Array<string>;
  owner?: string;
}>;

export class ListAllRoomsUseCase {
  constructor(private roomRepo: RoomRepositoryInterface) {}

  async execute(): Promise<[Error | null, FindAllPlayerOutput | null]> {
    try {
      const rooms = await this.roomRepo.findAll();
      return [null, rooms.map((r) => r.toJson())];
    } catch (error: any) {
      return [error, null];
    }
  }
}
