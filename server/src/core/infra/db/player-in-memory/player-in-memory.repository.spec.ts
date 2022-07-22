import { Player, PlayerProps } from "../../../domain";
import { PlayerInMemoryRepository } from "./player-in-memory.repository";

describe("Testing PlayerInMemoryRepository", () => {
  it("should insert a new player", async () => {
    const repository = new PlayerInMemoryRepository();
    const playerProps: PlayerProps = {
      name: "player x",
      rank: 30,
    };
    const player = new Player(playerProps);
    await repository.insert(player);

    expect(repository.items).toHaveLength(1);
    expect(repository.items).toStrictEqual([player]);
  });

  it("should find all players", async () => {
    const repository = new PlayerInMemoryRepository();
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

    await repository.insert(player1);
    await repository.insert(player2);

    expect(await repository.findAll()).toHaveLength(2);
    expect(await repository.findAll()).toStrictEqual([player1, player2]);
  });

  it("should find players by id", async () => {
    const repository = new PlayerInMemoryRepository();
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

    await repository.insert(player1);
    await repository.insert(player2);

    expect(
      await (await repository.findById(player1.id)).toJson()
    ).toStrictEqual(player1.toJson());
    expect(
      await (await repository.findById(player2.id)).toJson()
    ).toStrictEqual(player2.toJson());
  });
});
