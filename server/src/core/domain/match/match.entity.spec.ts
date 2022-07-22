import crypto from "crypto";
import { Match, MatchProps } from "./match.entity";

describe("Testing Match entity", () => {
  const matchProps: MatchProps = {
    blueSide: [
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
    ],
    redSide: [
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
      crypto.randomUUID(),
    ],
  };
  const match = new Match(matchProps);

  test("testing constructor", () => {
    expect(match.props).toStrictEqual({
      ...matchProps,
      status: "CHAMPION_SELECT",
      winner: "NOT_YET_FINISHED",
    });
  });

  test("testing constructor with six players, and should throw an exception", () => {
    const matchProps2: MatchProps = {
      blueSide: [
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ],
      redSide: [
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ],
    };

    try {
      new Match(matchProps2);
    } catch (err: any) {
      expect(err?.message).toStrictEqual(
        "Players per side is five and was passed blue = 6 and red = 4"
      );
    }
  });

  test("testing constructor with duplicated players, and should throw an exception", () => {
    const player1 = crypto.randomUUID();
    const player2 = crypto.randomUUID();
    const matchProps2: MatchProps = {
      blueSide: [
        player1,
        player2,
        player2,
        crypto.randomUUID(),
        crypto.randomUUID(),
      ],
      redSide: [
        player1,
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ],
    };

    try {
      new Match(matchProps2);
    } catch (err: any) {
      expect(err?.message).toStrictEqual("There are duplicated players");
    }
  });

  test("updateStatus method", () => {
    const status = "FINISHED";
    match.updateStatus(status);
    expect(match.status).toBe(status);
  });

  test("updateWinner method", () => {
    const winner = "REMAKE";
    match.updateWinner(winner);
    expect(match.winner).toBe(winner);
  });
});
