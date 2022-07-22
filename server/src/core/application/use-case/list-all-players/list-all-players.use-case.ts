import { PlayerRepositoryInterface } from "../../../domain";

type FindAllPlayerOutput = Array<{
  id: string;
  name: string;
  rank: number;
}>;

export class ListAllPlayersUseCase {
  constructor(private playerRepo: PlayerRepositoryInterface) {}

  async execute(): Promise<[Error | null, FindAllPlayerOutput | null]> {
    try {
      const players = await this.playerRepo.findAll();
      return [null, players.map((p) => p.toJson())];
    } catch (error: any) {
      return [error, null];
    }
  }
}
