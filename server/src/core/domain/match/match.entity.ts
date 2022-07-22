import crypto from 'crypto'

type PlayersId = Array<string>

const MAX_PLAYERS_PER_SIDE = 5
// const MAX_PLAYERS_PER_SIDE = 1

export type MatchProps = {
  winner?: 'NOT_YET_FINISHED' | 'RED_SIDE' | 'BLUE_SIDE' | 'REMAKE'
  status?: 'CHAMPION_SELECT' | 'LOADING_SCREEN' | 'IN_GAME' | 'FINISHED'
  blueSide: PlayersId
  redSide: PlayersId
}

export class Match {
  public readonly id: string
  public props: MatchProps

  constructor(props: MatchProps, id?: string) {
    if (
      this.checkPlayersPerSide(props.blueSide) ||
      this.checkPlayersPerSide(props.redSide)
    ) {
      throw new Error(
        `Players per side is five and was passed blue = ${props.blueSide.length} and red = ${props.redSide.length}`
      )
    }

    if (this.checkDuplicatePlayers([...props.blueSide, ...props.redSide])) {
      throw new Error(`There are duplicated players`)
    }

    this.id = id ?? crypto.randomUUID()
    this.props = {
      ...props,
      winner: props.winner ?? 'NOT_YET_FINISHED',
      status: props.status ?? 'CHAMPION_SELECT',
    }
  }

  private checkPlayersPerSide(value: PlayersId) {
    return value.length !== MAX_PLAYERS_PER_SIDE
  }

  private checkDuplicatePlayers(value: PlayersId) {
    const checked: Record<string, number> = {}
    for (const v of value) {
      if (checked[v]) {
        return true
      }
      checked[v] = 1
    }
    return false
  }

  updateWinner(winner: MatchProps['winner']) {
    this.props.winner = winner
  }

  get winner() {
    return this.props.winner
  }

  private set winner(value: MatchProps['winner']) {
    this.props.winner = value
  }

  updateStatus(status: MatchProps['status']) {
    this.status = status
  }

  get status() {
    return this.props.status
  }

  private set status(value: MatchProps['status']) {
    this.props.status = value
  }

  private set blueSide(value: PlayersId) {
    this.props.blueSide = value
  }

  get blueSide() {
    return this.props.blueSide
  }

  private set redSide(value: PlayersId) {
    this.props.redSide = value
  }

  get redSide() {
    return this.props.redSide
  }

  toJson() {
    return {
      id: this.id,
      ...this.props,
    }
  }
}
