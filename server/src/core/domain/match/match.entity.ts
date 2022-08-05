import crypto from 'crypto'

type PlayersId = Array<string>
type Side = 'RED' | 'BLUE'

const MAX_PLAYERS_PER_SIDE = Number(process.env.MAX_PLAYERS_PER_SIDE)

export type MatchProps = {
  winner?: 'NOT_YET_FINISHED' | 'RED_SIDE' | 'BLUE_SIDE' | 'REMAKE'
  status?: 'CHAMPION_SELECT' | 'LOADING_SCREEN' | 'IN_GAME' | 'FINISHED'
  blueSide?: PlayersId
  redSide?: PlayersId
  playerId: string
  side: Side
}

export class Match {
  public readonly id: string
  public props: MatchProps

  constructor(props: MatchProps, id?: string) {
    if (props.side === undefined) {
      throw new Error(`Missing side property`)
    }

    this.id = id ?? crypto.randomUUID()
    props.blueSide = []
    props.redSide = []
    props.side === 'RED'
      ? (props.redSide = [props.playerId])
      : (props.blueSide = [props.playerId])

    this.props = {
      ...props,
      winner: props.winner ?? 'NOT_YET_FINISHED',
      status: props.status ?? 'CHAMPION_SELECT',
    }
  }

  private checkPlayersPerSide(value: PlayersId) {
    return value.length > MAX_PLAYERS_PER_SIDE
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

  addPlayer(playerId: string, side: Side) {
    if (
      this.checkDuplicatePlayers([
        ...(this.props?.blueSide ?? []),
        ...(this.props?.redSide ?? []),
        playerId,
      ])
    ) {
      throw new Error(
        `There are duplicated players in ${side.toLocaleLowerCase()} side`
      )
    }

    if (
      this.checkPlayersPerSide([...(this.props?.blueSide ?? []), playerId]) ||
      this.checkPlayersPerSide([...(this.props?.redSide ?? []), playerId])
    ) {
      throw new Error(
        `Max Players per ${side.toLocaleLowerCase()} side exceeded`
      )
    }

    side === 'RED' ? (this.redSide = playerId) : (this.blueSide = playerId)
  }

  private set blueSide(value: string) {
    this.props.blueSide?.push(value)
  }

  private set redSide(value: string) {
    this.props.redSide?.push(value)
  }

  toJson() {
    return {
      id: this.id,
      blueSide: this.props.blueSide ?? [],
      redSide: this.props.redSide ?? [],
      winner: this.props.winner,
      status: this.props.status,
    }
  }
}
