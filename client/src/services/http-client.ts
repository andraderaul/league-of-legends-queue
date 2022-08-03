import axios, { AxiosPromise } from "axios";
import { Player, Room } from "../types";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:3001";

console.log(BASE_URL);
const httpClient = axios.create({
  baseURL: BASE_URL,
});

export const login = ({
  username,
}: {
  username: string;
}): AxiosPromise<Player> =>
  httpClient({
    method: "POST",
    url: "/players",
    data: {
      name: username,
      rank: 20,
    },
  });

export const createRoom = ({
  roomName,
  playerId,
}: {
  roomName: string;
  playerId: string;
}): AxiosPromise<Room> =>
  httpClient({
    method: "POST",
    url: "/rooms",
    data: {
      name: roomName,
      players: [playerId],
    },
  });

export const joinRoom = ({
  roomName,
  playerId,
}: {
  roomName: string;
  playerId: string;
}): AxiosPromise<Room> =>
  httpClient({
    method: "POST",
    url: `/rooms/${roomName}/join`,
    data: {
      playerId: playerId,
    },
  });

export const startQueue = ({
  roomName,
}: {
  roomName: string;
}): AxiosPromise<Room> =>
  httpClient({
    method: "POST",
    url: `/queue/start`,
    data: {
      name: roomName,
    },
  });

export const stopQueue = ({
  roomName,
}: {
  roomName: string;
}): AxiosPromise<Room> =>
  httpClient({
    method: "POST",
    url: `/queue/stop`,
    data: {
      name: roomName,
    },
  });

type CreateMatchProps = {
  roomName: string;
  playerId: string;
  matchId: string;
  side: string;
};

export const createMatch = ({
  roomName,
  playerId,
  matchId,
  side,
}: CreateMatchProps) =>
  httpClient({
    method: "POST",
    url: "/matches",
    data: {
      roomName,
      playerId,
      side,
      matchId,
    },
  });
