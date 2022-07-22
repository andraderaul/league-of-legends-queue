import { Room, RoomProps, Player, PlayerProps } from "../../../domain";
import { RoomInMemoryRepository } from "./room-in-memory.repository";

describe("Testing RoomInMemoryRepository", () => {
  it("should insert a new room", async () => {
    const repository = new RoomInMemoryRepository();
    const playerProps: PlayerProps = {
      name: "Player X",
      rank: 10,
    };
    const player = new Player(playerProps);
    const roomProps: RoomProps = {
      name: "Room x",
      players: [player.id],
    };
    const room = new Room(roomProps);
    await repository.insert(room);

    expect(repository.items).toHaveLength(1);
    expect(repository.items).toStrictEqual([room]);
  });

  it("should find all rooms", async () => {
    const repository = new RoomInMemoryRepository();
    const playerProps1: PlayerProps = {
      name: "player 1",
      rank: 40,
    };
    const playerProps2: PlayerProps = {
      name: "player 2",
      rank: 50,
    };

    const player1 = new Player(playerProps1);
    const player2 = new Player(playerProps2);

    const roomProps1: RoomProps = {
      name: "Room x1",
      players: [player1.id],
    };
    const room1 = new Room(roomProps1);
    await repository.insert(room1);

    const roomProps2: RoomProps = {
      name: "Room x2",
      players: [player2.id],
    };
    const room2 = new Room(roomProps2);
    await repository.insert(room2);

    expect(await repository.findAll()).toHaveLength(2);
    expect(await repository.findAll()).toStrictEqual([room1, room2]);
  });

  it("should find rooms by name", async () => {
    const repository = new RoomInMemoryRepository();
    const playerProps1: PlayerProps = {
      name: "player 1",
      rank: 40,
    };
    const playerProps2: PlayerProps = {
      name: "player 2",
      rank: 50,
    };

    const player1 = new Player(playerProps1);
    const player2 = new Player(playerProps2);

    const roomProps1: RoomProps = {
      name: "Room x1",
      players: [player1.id],
    };
    const room1 = new Room(roomProps1);
    await repository.insert(room1);

    const roomProps2: RoomProps = {
      name: "Room x2",
      players: [player2.id],
    };
    const room2 = new Room(roomProps2);
    await repository.insert(room2);

    expect(
      await (await repository.findByName(room1.name)).toJson()
    ).toStrictEqual(room1.toJson());
    expect(
      await (await repository.findByName(room2.name)).toJson()
    ).toStrictEqual(room2.toJson());
  });
});
