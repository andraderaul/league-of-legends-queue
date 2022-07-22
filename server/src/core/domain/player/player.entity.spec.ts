import { Player, PlayerProps } from "./player.entity";

describe("Testing Player entity", () => {
  const playerProps: PlayerProps = {
    name: "Mcr raulzera",
    rank: 10,
  };
  const player = new Player(playerProps);

  test("testing constructor", () => {
    expect(player.props).toStrictEqual(playerProps);
  });

  test("updateName method", () => {
    const newName = "MCR RAULZERA";
    player.updateName(newName);
    expect(player.name).toBe(newName);
  });

  test("updateRank method", () => {
    const newRank = 20;
    player.updateRank(newRank);
    expect(player.rank).toBe(newRank);
  });
});
