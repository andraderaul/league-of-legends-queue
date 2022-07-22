import { RoomRepositoryInterface } from "../../../domain";

type StartQueueInput = {
  name: string;
};

type StartQueueOutput = {
  id: string;
  name: string;
  players: Array<string>;
  owner?: string;
};

export class StartQueueUseCase {
  constructor(private roomRepo: RoomRepositoryInterface) {}

  async execute(
    input: StartQueueInput
  ): Promise<[Error | null, StartQueueOutput | null]> {
    try {
      const room = await this.roomRepo.findByName(input.name);
      room.startInQueue();

      return [null, room.toJson()];
    } catch (error: any) {
      return [error, null];
    }
  }
}
