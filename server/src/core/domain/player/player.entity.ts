import crypto from 'crypto'

export type PlayerProps = {
  name: string
  rank: number
}

export class Player {
  public readonly id: string
  public props: PlayerProps

  constructor(props: PlayerProps, id?: string) {
    this.id = id ?? crypto.randomUUID()
    this.props = props
  }

  updateName(name: string) {
    this.props.name = name
  }

  get name() {
    return this.props.name
  }

  private set name(value: string) {
    this.props.name = value
  }

  updateRank(rank: number) {
    this.rank = rank
  }

  get rank() {
    return this.props.rank
  }

  private set rank(value: number) {
    this.props.rank = value
  }

  toJson() {
    return {
      id: this.id,
      ...this.props,
    }
  }
}
