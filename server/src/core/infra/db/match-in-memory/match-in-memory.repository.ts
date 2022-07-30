import { Match, MatchRepositoryInterface } from '../../../domain'

export class MatchInMemoryRepository implements MatchRepositoryInterface {
  items: Array<Match> = []

  async insert(match: Match): Promise<void> {
    this.items.push(match)
  }

  async findAll(): Promise<Match[]> {
    return this.items
  }

  async findById(matchId: string): Promise<Match> {
    const match = this.items.find((m) => m.id === matchId)
    if (match === undefined) {
      throw new Error(`Not found match with id ${matchId}`)
    }

    return match
  }
}
