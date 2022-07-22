import { RoomRepositoryInterface } from "../../../domain";

type StopQueueInput = {
  name: string;
};

type StopQueueOutput = {
  id: string;
  name: string;
  players: Array<string>;
  owner?: string;
};

export class StopQueueUseCase {
  constructor(private roomRepo: RoomRepositoryInterface) {}

  async execute(
    input: StopQueueInput
  ): Promise<[Error | null, StopQueueOutput | null]> {
    try {
      const room = await this.roomRepo.findByName(input.name);
      room.stopInQueue();

      return [null, room.toJson()];
    } catch (error: any) {
      return [error, null];
    }
  }
}
