import { Player, PlayerRepositoryInterface } from '../../../domain'

export class PlayerInMemoryRepository implements PlayerRepositoryInterface {
  items: Array<Player> = []

  async insert(player: Player): Promise<void> {
    const playerAlreadyRegister = this.items.find((p) => p.name === player.name)
    if (playerAlreadyRegister) {
      throw new Error(`Player name already register ${player.name}`)
    }

    this.items.push(player)
  }

  async findAll(): Promise<Player[]> {
    return this.items
  }

  async findById(playerId: string): Promise<Player> {
    const player = this.items.find((p) => p.id === playerId)
    if (player === undefined) {
      throw new Error(`Not found player with id ${playerId}`)
    }

    return player
  }
}
