import { Match, MatchRepositoryInterface } from "../../../domain";

export class MatchInMemoryRepository implements MatchRepositoryInterface {
  items: Array<Match> = [];

  async insert(match: Match): Promise<void> {
    this.items.push(match);
  }

  async findAll(): Promise<Match[]> {
    return this.items;
  }
}
