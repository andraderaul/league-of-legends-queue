import { Player, PlayerRepositoryInterface } from "../../../domain";

type CreatePlayerInput = {
  name: string;
  rank: number;
};

type CreatePlayerOutput = {
  id: string;
  name: string;
  rank: number;
};

export class CreatePlayerUseCase {
  constructor(private playerRepo: PlayerRepositoryInterface) {}

  async execute(
    input: CreatePlayerInput
  ): Promise<[Error | null, CreatePlayerOutput | null]> {
    try {
      const player = new Player(input);
      await this.playerRepo.insert(player);

      return [null, player.toJson()];
    } catch (error: any) {
      return [error, null];
    }
  }
}
