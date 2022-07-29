import {
  MatchInMemoryRepository,
  PlayerInMemoryRepository,
  RoomInMemoryRepository,
} from '../../core/infra/db'

export const roomRepo = new RoomInMemoryRepository()
export const playerRepo = new PlayerInMemoryRepository()
export const matchRepo = new MatchInMemoryRepository()
