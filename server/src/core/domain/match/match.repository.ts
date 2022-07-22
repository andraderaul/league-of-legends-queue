import { Match } from "./match.entity";

export interface MatchRepositoryInterface {
  insert(player: Match): Promise<void>;
  findAll(): Promise<Array<Match>>;
}
