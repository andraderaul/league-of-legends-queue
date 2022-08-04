import crypto from 'crypto'
import {
  PlayerRepositoryInterface,
  RoomRepositoryInterface,
} from '../../../domain'

const NUMBER_PLAYERS_PER_SIDE = Number(process.env.NUMBER_PLAYERS_PER_SIDE)

type Player = { id: string; name: string; rank: number }

type FindMatchOutput = {
  id: string
  blueSide: Array<Player>
  redSide: Array<Player>
}

export class FindMatchUseCase {
  constructor(
    private roomRepo: RoomRepositoryInterface,
    private playerRepo: PlayerRepositoryInterface
  ) {}

  async executeLegacy(): Promise<[Error | null, FindMatchOutput | null]> {
    try {
      const rooms = await this.roomRepo.findAllInQueue()

      const roomsWithPlayers: Array<{
        roomPlayers: Array<Player>
        roomRank: number
        roomLength: number
      }> = []
      for (const room of rooms) {
        const players = []
        for (const playerId of room.players) {
          const player = await this.playerRepo.findById(playerId)
          players.push(player.toJson())
        }

        roomsWithPlayers.push({
          roomPlayers: players,
          roomLength: players.length,
          roomRank:
            players.reduce((prev, curr) => prev + curr.rank, 0) /
            players.length,
        })
      }

      const selected = roomsWithPlayers.filter(
        (r) => r.roomRank > 10 && r.roomRank < 80
      )

      const hash: Record<string, Array<number>> = {}

      /* when two rooms have five players */
      if (
        selected.length === 2 &&
        selected[0].roomLength === NUMBER_PLAYERS_PER_SIDE &&
        selected[1].roomLength === NUMBER_PLAYERS_PER_SIDE
      ) {
        const result = {
          id: '',
          blueSide: selected[0].roomPlayers,
          redSide: selected[1].roomPlayers,
        }

        return [null, result]
      }

      const sides: Array<Array<Player>> = []
      for (let i = 0; i < selected.length; i++) {
        if (hash[selected[i].roomLength]) {
          hash[selected[i].roomLength].push(i)
        } else {
          hash[selected[i].roomLength] = [i]
        }
      }

      for (let i = 0; i < selected.length; i++) {
        const key = NUMBER_PLAYERS_PER_SIDE - selected[i].roomLength
        console.log(hash[key], selected[i].roomLength)
        if (hash[key]?.length && !hash[key].includes(i)) {
          const hashKey = hash[key].pop()

          sides.push([
            ...selected[hashKey || 0].roomPlayers,
            ...selected[i].roomPlayers,
          ])

          if (sides.length === 2) {
            break
          }
        }
      }

      /* all rooms has one player */
      if (sides.length === 0 && hash[1]?.length === 10) {
        const x: Array<Player> = []
        const y: Array<Player> = []

        hash[1].forEach((n, index) => {
          if (index % 2 === 0) {
            x.push(...selected[n].roomPlayers)
          } else {
            y.push(...selected[n].roomPlayers)
          }
        })

        sides.push(x, y)
      }

      const result = {
        id: '',
        blueSide: sides[0],
        redSide: sides[1],
      }

      return [null, result]
    } catch (error: any) {
      return [error, null]
    }
  }

  //READ THOSE:
  // https://en.wikipedia.org/wiki/Quadratic_assignment_problem
  // https://www.geeksforgeeks.org/job-assignment-problem-using-branch-and-bound/
  async execute(): Promise<[Error | null, FindMatchOutput | null]> {
    try {
      const rooms = await this.roomRepo.findAllInQueue()

      const roomsWithPlayers: Array<{
        roomPlayers: Array<Player>
        roomRank: number
        roomLength: number
      }> = []
      for (const room of rooms) {
        const players = []
        for (const playerId of room.players) {
          const player = await this.playerRepo.findById(playerId)
          players.push(player.toJson())
        }

        roomsWithPlayers.push({
          roomPlayers: players,
          roomLength: players.length,
          roomRank:
            players.reduce((acc, curr) => acc + curr.rank, 0) / players.length,
        })
      }

      const selected = roomsWithPlayers.filter(
        (r) => r.roomRank > 10 && r.roomRank < 80
      )

      const total = selected.reduce((acc, curr) => acc + curr.roomLength, 0)

      if (total < NUMBER_PLAYERS_PER_SIDE * 2) {
        return [new Error("There aren't enough players"), null]
      }

      const visited: Array<number> = []
      const sides = []
      selected.sort((a, b) => b.roomLength - a.roomLength)

      for (let i = 0; i < selected.length; i++) {
        const time: Array<number> = []

        if (!visited.includes(i)) {
          visited.push(i)
          let j = i
          let aux = 0
          while (j < selected.length) {
            if (
              aux + selected[j].roomLength <= NUMBER_PLAYERS_PER_SIDE &&
              !sides?.[0]?.includes(j)
            ) {
              aux += selected[j].roomLength
              time.push(j)
            }
            j++
          }

          if (aux === NUMBER_PLAYERS_PER_SIDE) {
            sides.push(time)
          }
        }

        if (sides.length == 2) {
          break
        }
      }

      const result = {
        id: crypto.randomUUID(),
        blueSide: sides[0].reduce<Array<Player>>(
          (acc, curr) => [...acc, ...selected[curr].roomPlayers],
          []
        ),
        redSide: sides[1].reduce<Array<Player>>(
          (acc, curr) => [...acc, ...selected[curr].roomPlayers],
          []
        ),
      }

      return [null, result]
    } catch (error: any) {
      return [error, null]
    }
  }
}
