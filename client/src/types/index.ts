export type Player = {
  id: string;
  name: string;
  rank: number;
};

export type Players = Array<Player>;

export type Room = {
  id: string;
  name: string;
  owner: string;
  inQueue: boolean;
  players?: Players;
};

export type Side = Array<Player>;
