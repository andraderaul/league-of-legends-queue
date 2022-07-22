import crypto from "crypto";
import { Room, RoomProps } from "./room.entity";

describe("Testing Room entity", () => {
  test("testing constructor with one players", () => {
    const ownerPlayerId = crypto.randomUUID();
    const roomProps: RoomProps = {
      name: "Room One",
      players: [ownerPlayerId],
    };

    const room = new Room(roomProps);

    expect(room.props).toStrictEqual({
      ...roomProps,
      owner: ownerPlayerId,
      inQueue: false,
    });
  });

  test("testing constructor with five players", () => {
    const ownerPlayerId = crypto.randomUUID();

    const roomProps: RoomProps = {
      name: "Room One",
      players: [
        ownerPlayerId,
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ],
      owner: ownerPlayerId,
    };

    const room = new Room(roomProps);

    expect(room.props).toStrictEqual({ ...roomProps, inQueue: false });
  });

  test("testing constructor with six players, and should throw an exception", () => {
    const roomProps: RoomProps = {
      name: "Room One",
      players: [
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ],
    };

    try {
      new Room(roomProps);
    } catch (err: any) {
      expect(err?.message).toStrictEqual(
        "Max players per room is five and was passed 6"
      );
    }
  });

  test("testing constructor with duplicated players, and should throw an exception", () => {
    const player = crypto.randomUUID();
    const roomProps: RoomProps = {
      name: "Room One",
      players: [
        player,
        player,
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ],
    };

    try {
      new Room(roomProps);
    } catch (err: any) {
      expect(err?.message).toStrictEqual("There are duplicated players");
    }
  });

  test("updateName method", () => {
    const roomProps: RoomProps = {
      name: "Room One",
      players: [crypto.randomUUID()],
    };
    const newName = "Room ten";
    const room = new Room(roomProps);

    room.updateName(newName);
    expect(room.name).toBe(newName);
  });

  test("addPlayer method, should not add more than five players", () => {
    const roomProps: RoomProps = {
      name: "Room One",
      players: [crypto.randomUUID()],
    };
    const room = new Room(roomProps);

    for (let i = 0; i < 10; i++) {
      const player = crypto.randomUUID();

      room.addPlayer(player);
    }
    expect(room.players).toHaveLength(5);
  });

  test("addPlayer method, should not add twice the same player", () => {
    const playerId = crypto.randomUUID();
    const roomProps: RoomProps = {
      name: "Room One",
      players: [playerId],
    };
    const room = new Room(roomProps);

    room.addPlayer(playerId);

    expect(room.players).toHaveLength(1);
  });

  test("removePlayer method", () => {
    const playerOwner = crypto.randomUUID();

    const roomProps: RoomProps = {
      name: "Room One",
      players: [playerOwner],
    };
    const room = new Room(roomProps);

    for (let i = 0; i < 5; i++) {
      const player = crypto.randomUUID();

      room.addPlayer(player);
    }

    room.removePlayer(playerOwner);
    expect(room.players).toHaveLength(4);
    room.players.forEach((p) => room.removePlayer(p));
    expect(room.players).toHaveLength(0);
  });

  test("startInQueue method", () => {
    const playerOwner = crypto.randomUUID();

    const roomProps: RoomProps = {
      name: "Room One",
      players: [playerOwner],
    };
    const room = new Room(roomProps);
    room.startInQueue();
    expect(room.props).toStrictEqual({
      ...roomProps,
      owner: playerOwner,
      inQueue: true,
    });
  });

  test("stopInQueue method", () => {
    const playerOwner = crypto.randomUUID();

    const roomProps: RoomProps = {
      name: "Room One",
      players: [playerOwner],
    };
    const room = new Room(roomProps);
    room.startInQueue();
    room.stopInQueue();

    expect(room.props).toStrictEqual({
      ...roomProps,
      owner: playerOwner,
      inQueue: false,
    });
  });
});
