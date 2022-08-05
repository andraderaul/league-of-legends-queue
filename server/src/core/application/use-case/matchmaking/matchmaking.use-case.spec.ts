/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  PlayerInMemoryRepository,
  RoomInMemoryRepository,
} from '../../../infra/db'
import { CreatePlayerUseCase } from '../create-player'
import { CreateRoomUseCase } from '../create-room'
import { MatchmakingUseCase } from './matchmaking.use-case'

describe('Testing MatchmakingUseCase', () => {
  it('should have match, when two rooms has three players and two rooms has two players', async () => {
    const roomRepository = new RoomInMemoryRepository()
    const playerRepository = new PlayerInMemoryRepository()

    const createPlayerUseCase = new CreatePlayerUseCase(playerRepository)
    const [, p1] = await createPlayerUseCase.execute({
      name: 'player x',
      rank: 100,
    })
    const [, p2] = await createPlayerUseCase.execute({
      name: 'player y',
      rank: 50,
    })
    const [, p3] = await createPlayerUseCase.execute({
      name: 'player z',
      rank: 30,
    })

    const input1 = {
      name: 'Room-7',
      players: [p1!.id, p2!.id, p3!.id],
      owner: p1!.id,
      inQueue: true,
    }

    //#######

    const [, pA] = await createPlayerUseCase.execute({
      name: 'player a',
      rank: 20,
    })
    const [, pB] = await createPlayerUseCase.execute({
      name: 'player b',
      rank: 40,
    })
    const [, pC] = await createPlayerUseCase.execute({
      name: 'player c',
      rank: 80,
    })

    const input2 = {
      name: 'Room-10',
      players: [pA!.id, pB!.id, pC!.id],
      owner: pA!.id,
      inQueue: true,
    }

    // ####

    const [, p4] = await createPlayerUseCase.execute({
      name: 'player k',
      rank: 50,
    })
    const [, p5] = await createPlayerUseCase.execute({
      name: 'player w',
      rank: 30,
    })
    const input3 = {
      name: 'Room-11',
      players: [p4!.id, p5!.id],
      owner: p4!.id,
      inQueue: true,
    }

    /// ####
    const [, pD] = await createPlayerUseCase.execute({
      name: 'player d',
      rank: 40,
    })
    const [, pE] = await createPlayerUseCase.execute({
      name: 'player e',
      rank: 80,
    })
    const input4 = {
      name: 'Room-10',
      players: [pD!.id, pE!.id],
      owner: pD!.id,
      inQueue: true,
    }

    const createUseCase = new CreateRoomUseCase(roomRepository)
    await createUseCase.execute(input1)
    await createUseCase.execute(input2)
    await createUseCase.execute(input3)
    await createUseCase.execute(input4)

    const matchUseCase = new MatchmakingUseCase(
      roomRepository,
      playerRepository
    )
    const [error, output] = await matchUseCase.execute()
    expect(error).toBeNull()
    expect(output?.blueSide).toStrictEqual([p1, p2, p3, p4, p5])
    expect(output?.redSide).toStrictEqual([pA, pB, pC, pD, pE])
  })

  it('should have match, when four rooms has two players and two rooms has one player', async () => {
    const roomRepository = new RoomInMemoryRepository()
    const playerRepository = new PlayerInMemoryRepository()

    const createPlayerUseCase = new CreatePlayerUseCase(playerRepository)
    const [, p1] = await createPlayerUseCase.execute({
      name: 'player x',
      rank: 76,
    })
    const [, p2] = await createPlayerUseCase.execute({
      name: 'player y',
      rank: 74,
    })

    const input1 = {
      name: 'Room-7',
      players: [p1!.id, p2!.id],
      owner: p1!.id,
      inQueue: true,
    }

    //#####

    const [, p3] = await createPlayerUseCase.execute({
      name: 'player z',
      rank: 77,
    })
    const [, pA] = await createPlayerUseCase.execute({
      name: 'player a',
      rank: 76,
    })

    const input2 = {
      name: 'Room-8',
      players: [p3!.id, pA!.id],
      owner: p3!.id,
      inQueue: true,
    }

    //#######

    const [, pB] = await createPlayerUseCase.execute({
      name: 'player b',
      rank: 72,
    })
    const [, pC] = await createPlayerUseCase.execute({
      name: 'player c',
      rank: 71,
    })

    const input3 = {
      name: 'Room-10',
      players: [pB!.id, pC!.id],
      owner: pB!.id,
      inQueue: true,
    }

    // ####

    const [, p4] = await createPlayerUseCase.execute({
      name: 'player k',
      rank: 70,
    })
    const [, p5] = await createPlayerUseCase.execute({
      name: 'player w',
      rank: 72,
    })
    const input4 = {
      name: 'Room-11',
      players: [p4!.id, p5!.id],
      owner: p4!.id,
      inQueue: true,
    }

    /// ####
    const [, pD] = await createPlayerUseCase.execute({
      name: 'player d',
      rank: 79,
    })
    const input5 = {
      name: 'Room-15',
      players: [pD!.id],
      owner: pD!.id,
      inQueue: true,
    }

    const [, pE] = await createPlayerUseCase.execute({
      name: 'player e',
      rank: 78,
    })
    const input6 = {
      name: 'Room-13',
      players: [pE!.id],
      owner: pE!.id,
      inQueue: true,
    }

    const createUseCase = new CreateRoomUseCase(roomRepository)
    await createUseCase.execute(input1)
    await createUseCase.execute(input2)
    await createUseCase.execute(input3)
    await createUseCase.execute(input4)
    await createUseCase.execute(input5)
    await createUseCase.execute(input6)

    const matchUseCase = new MatchmakingUseCase(
      roomRepository,
      playerRepository
    )
    const [error, output] = await matchUseCase.execute()
    expect(error).toBeNull()
    expect(output?.blueSide).toStrictEqual([p1, p2, p3, pA, pD])
    expect(output?.redSide).toStrictEqual([pB, pC, p4, p5, pE])
  })

  it('should have match, when two rooms has five players', async () => {
    const roomRepository = new RoomInMemoryRepository()
    const playerRepository = new PlayerInMemoryRepository()

    const createPlayerUseCase = new CreatePlayerUseCase(playerRepository)
    const [, p1] = await createPlayerUseCase.execute({
      name: 'player x',
      rank: 100,
    })
    const [, p2] = await createPlayerUseCase.execute({
      name: 'player y',
      rank: 50,
    })
    const [, p3] = await createPlayerUseCase.execute({
      name: 'player z',
      rank: 30,
    })
    const [, p4] = await createPlayerUseCase.execute({
      name: 'player k',
      rank: 50,
    })
    const [, p5] = await createPlayerUseCase.execute({
      name: 'player w',
      rank: 30,
    })

    const input1 = {
      name: 'Room-7',
      players: [p1!.id, p2!.id, p3!.id, p4!.id, p5!.id],
      owner: p1!.id,
      inQueue: true,
    }

    //#######

    const [, pA] = await createPlayerUseCase.execute({
      name: 'player a',
      rank: 20,
    })
    const [, pB] = await createPlayerUseCase.execute({
      name: 'player b',
      rank: 40,
    })
    const [, pC] = await createPlayerUseCase.execute({
      name: 'player c',
      rank: 80,
    })

    const [, pD] = await createPlayerUseCase.execute({
      name: 'player d',
      rank: 40,
    })
    const [, pE] = await createPlayerUseCase.execute({
      name: 'player e',
      rank: 80,
    })

    const input2 = {
      name: 'Room-10',
      players: [pA!.id, pB!.id, pC!.id, pD!.id, pE!.id],
      owner: pA!.id,
      inQueue: true,
    }

    const createUseCase = new CreateRoomUseCase(roomRepository)
    await createUseCase.execute(input1)
    await createUseCase.execute(input2)

    const matchUseCase = new MatchmakingUseCase(
      roomRepository,
      playerRepository
    )
    const [error, output] = await matchUseCase.execute()
    expect(error).toBeNull()
    expect(output?.blueSide).toStrictEqual([p1, p2, p3, p4, p5])
    expect(output?.redSide).toStrictEqual([pA, pB, pC, pD, pE])
  })

  it('should have match, when two rooms has four players and two rooms has one player', async () => {
    const roomRepository = new RoomInMemoryRepository()
    const playerRepository = new PlayerInMemoryRepository()

    const createPlayerUseCase = new CreatePlayerUseCase(playerRepository)
    const [, p1] = await createPlayerUseCase.execute({
      name: 'player x',
      rank: 100,
    })
    const [, p2] = await createPlayerUseCase.execute({
      name: 'player y',
      rank: 50,
    })
    const [, p3] = await createPlayerUseCase.execute({
      name: 'player z',
      rank: 30,
    })
    const [, p4] = await createPlayerUseCase.execute({
      name: 'player k',
      rank: 50,
    })

    const input1 = {
      name: 'Room-7',
      players: [p1!.id, p2!.id, p3!.id, p4!.id],
      owner: p1!.id,
      inQueue: true,
    }

    //#######

    const [, pA] = await createPlayerUseCase.execute({
      name: 'player a',
      rank: 20,
    })
    const [, pB] = await createPlayerUseCase.execute({
      name: 'player b',
      rank: 40,
    })
    const [, pC] = await createPlayerUseCase.execute({
      name: 'player c',
      rank: 80,
    })
    const [, pD] = await createPlayerUseCase.execute({
      name: 'player d',
      rank: 40,
    })

    const input2 = {
      name: 'Room-10',
      players: [pA!.id, pB!.id, pC!.id, pD!.id],
      owner: pA!.id,
      inQueue: true,
    }

    // ####
    const [, p5] = await createPlayerUseCase.execute({
      name: 'player w',
      rank: 30,
    })
    const input3 = {
      name: 'Room-11',
      players: [p5!.id],
      owner: p5!.id,
      inQueue: true,
    }

    /// ####
    const [, pE] = await createPlayerUseCase.execute({
      name: 'player e',
      rank: 79,
    })
    const input4 = {
      name: 'Room-10',
      players: [pE!.id],
      owner: pE!.id,
      inQueue: true,
    }

    const createUseCase = new CreateRoomUseCase(roomRepository)
    await createUseCase.execute(input1)
    await createUseCase.execute(input2)
    await createUseCase.execute(input3)
    await createUseCase.execute(input4)

    const matchUseCase = new MatchmakingUseCase(
      roomRepository,
      playerRepository
    )
    const [error, output] = await matchUseCase.execute()
    expect(error).toBeNull()
    expect(output?.blueSide).toStrictEqual([p1, p2, p3, p4, p5])
    expect(output?.redSide).toStrictEqual([pA, pB, pC, pD, pE])
  })

  it('should have match, when ten rooms has one player', async () => {
    const roomRepository = new RoomInMemoryRepository()
    const playerRepository = new PlayerInMemoryRepository()

    const createPlayerUseCase = new CreatePlayerUseCase(playerRepository)
    const [, p1] = await createPlayerUseCase.execute({
      name: 'player x',
      rank: 79,
    })
    const [, p2] = await createPlayerUseCase.execute({
      name: 'player y',
      rank: 50,
    })

    const [, p3] = await createPlayerUseCase.execute({
      name: 'player z',
      rank: 30,
    })
    const [, p4] = await createPlayerUseCase.execute({
      name: 'player k',
      rank: 50,
    })
    const [, p5] = await createPlayerUseCase.execute({
      name: 'player w',
      rank: 30,
    })
    const [, pA] = await createPlayerUseCase.execute({
      name: 'player a',
      rank: 20,
    })
    const [, pB] = await createPlayerUseCase.execute({
      name: 'player b',
      rank: 40,
    })
    const [, pC] = await createPlayerUseCase.execute({
      name: 'player c',
      rank: 76,
    })
    const [, pD] = await createPlayerUseCase.execute({
      name: 'player d',
      rank: 40,
    })
    const [, pE] = await createPlayerUseCase.execute({
      name: 'player e',
      rank: 79,
    })

    const input1 = {
      name: 'Room-1',
      players: [p1!.id],
      owner: p1!.id,
      inQueue: true,
    }
    const input2 = {
      name: 'Room-2',
      players: [p2!.id],
      owner: p2!.id,
      inQueue: true,
    }
    const input3 = {
      name: 'Room-3',
      players: [p3!.id],
      owner: p3!.id,
      inQueue: true,
    }
    const input4 = {
      name: 'Room-4',
      players: [p4!.id],
      owner: p4!.id,
      inQueue: true,
    }
    const input5 = {
      name: 'Room-5',
      players: [p5!.id],
      owner: p5!.id,
      inQueue: true,
    }

    //#######

    const inputA = {
      name: 'Room-A',
      players: [pA!.id],
      owner: pA!.id,
      inQueue: true,
    }
    const inputB = {
      name: 'Room-B',
      players: [pB!.id],
      owner: pB!.id,
      inQueue: true,
    }
    const inputC = {
      name: 'Room-C',
      players: [pC!.id],
      owner: pC!.id,
      inQueue: true,
    }
    const inputD = {
      name: 'Room-D',
      players: [pD!.id],
      owner: pD!.id,
      inQueue: true,
    }
    const inputE = {
      name: 'Room-E',
      players: [pE!.id],
      owner: pE!.id,
      inQueue: true,
    }

    const createUseCase = new CreateRoomUseCase(roomRepository)
    await createUseCase.execute(input1)
    await createUseCase.execute(input2)
    await createUseCase.execute(input3)
    await createUseCase.execute(input4)
    await createUseCase.execute(input5)
    await createUseCase.execute(inputA)
    await createUseCase.execute(inputB)
    await createUseCase.execute(inputC)
    await createUseCase.execute(inputD)
    await createUseCase.execute(inputE)

    const matchUseCase = new MatchmakingUseCase(
      roomRepository,
      playerRepository
    )
    const [error, output] = await matchUseCase.execute()
    expect(error).toBeNull()

    expect(output?.blueSide).toStrictEqual([p1, p2, p3, p4, p5])
    expect(output?.redSide).toStrictEqual([pA, pB, pC, pD, pE])
  })

  it("should return an error when there aren't enough players", async () => {
    const roomRepository = new RoomInMemoryRepository()
    const playerRepository = new PlayerInMemoryRepository()

    const createPlayerUseCase = new CreatePlayerUseCase(playerRepository)
    const [, p1] = await createPlayerUseCase.execute({
      name: 'player x',
      rank: 100,
    })
    const [, p2] = await createPlayerUseCase.execute({
      name: 'player y',
      rank: 50,
    })

    const input1 = {
      name: 'Room-7',
      players: [p1!.id, p2!.id],
      owner: p1!.id,
      inQueue: true,
    }

    //#######

    const [, pA] = await createPlayerUseCase.execute({
      name: 'player a',
      rank: 20,
    })
    const [, pB] = await createPlayerUseCase.execute({
      name: 'player b',
      rank: 40,
    })
    const [, pC] = await createPlayerUseCase.execute({
      name: 'player c',
      rank: 80,
    })

    const input2 = {
      name: 'Room-10',
      players: [pA!.id, pB!.id, pC!.id],
      owner: pA!.id,
      inQueue: true,
    }

    // ####

    const [, p4] = await createPlayerUseCase.execute({
      name: 'player k',
      rank: 50,
    })
    const [, p5] = await createPlayerUseCase.execute({
      name: 'player w',
      rank: 30,
    })
    const input3 = {
      name: 'Room-11',
      players: [p4!.id, p5!.id],
      owner: p4!.id,
      inQueue: true,
    }

    /// ####
    const [, pD] = await createPlayerUseCase.execute({
      name: 'player d',
      rank: 40,
    })

    const input4 = {
      name: 'Room-10',
      players: [pD!.id],
      owner: pD!.id,
      inQueue: true,
    }

    const createUseCase = new CreateRoomUseCase(roomRepository)
    await createUseCase.execute(input1)
    await createUseCase.execute(input2)
    await createUseCase.execute(input3)
    await createUseCase.execute(input4)

    const matchUseCase = new MatchmakingUseCase(
      roomRepository,
      playerRepository
    )
    const [error] = await matchUseCase.execute()
    expect(error?.message).toBe("There aren't enough players")
  })
})
