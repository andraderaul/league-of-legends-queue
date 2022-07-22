import { Player } from "./player.entity";

export interface PlayerRepositoryInterface {
  insert(player: Player): Promise<void>;
  findAll(): Promise<Array<Player>>;
  findById(playerId: string): Promise<Player>;
}
