import crypto from "crypto";

type PlayerId = string;
type Players = Array<string>;

export type RoomProps = {
  name: string;
  players: Players;
  owner?: PlayerId;
  inQueue?: boolean;
};

const MAX_PLAYERS_PER_ROOM = 5;

export class Room {
  public readonly id: string;
  public props: Required<RoomProps>;

  constructor(props: RoomProps, id?: string) {
    if (this.checkMaxPlayers(props.players)) {
      throw new Error(
        `Max players per room is five and was passed ${props.players.length}`
      );
    }

    if (this.checkDuplicatePlayers(props.players)) {
      throw new Error(`There are duplicated players`);
    }

    this.id = id ?? crypto.randomUUID();

    this.props = {
      ...props,
      inQueue: props.inQueue ?? false,
      owner: props.owner ?? props.players[0],
    };
  }

  private checkMaxPlayers(value: Players) {
    return value.length > MAX_PLAYERS_PER_ROOM;
  }

  private checkDuplicatePlayers(value: Players) {
    const checked: Record<string, number> = {};
    for (const v of value) {
      if (checked[v]) {
        return true;
      }
      checked[v] = 1;
    }
    return false;
  }

  removePlayer(playerId: PlayerId) {
    this.players = this.props.players.filter(
      (pId) => pId !== playerId
    ) as Players;
  }

  addPlayer(playerId: PlayerId) {
    if (
      this.players.length < MAX_PLAYERS_PER_ROOM &&
      !this.players.includes(playerId)
    ) {
      this.player = playerId;
    }
  }

  private set player(value: PlayerId) {
    this.props.players.push(value);
  }

  get players() {
    return this.props.players;
  }

  private set players(value: Players) {
    this.props.players = value;
  }

  updateName(name: string) {
    this.props.name = name;
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  startInQueue() {
    this.props.inQueue = true;
  }

  stopInQueue() {
    this.props.inQueue = false;
  }

  get inQueue() {
    return this.props.inQueue;
  }

  private set inQueue(value: boolean) {
    this.props.inQueue = value;
  }

  toJson() {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
