import crypto from "crypto";
import { MatchProps, Match } from "../../../domain";
import { MatchInMemoryRepository } from "./match-in-memory.repository";

describe("Testing MatchInMemoryRepository", () => {
  it("should insert a new match", async () => {
    const repository = new MatchInMemoryRepository();
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
    await repository.insert(match);

    expect(repository.items).toHaveLength(1);
    expect(repository.items).toStrictEqual([match]);
  });

  it("should find all match", async () => {
    const repository = new MatchInMemoryRepository();
    const matchProps1: MatchProps = {
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
    const matchProps2: MatchProps = {
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

    const match1 = new Match(matchProps1);
    const match2 = new Match(matchProps2);

    await repository.insert(match1);
    await repository.insert(match2);

    expect(await repository.findAll()).toHaveLength(2);
    expect(await repository.findAll()).toStrictEqual([match1, match2]);
  });
});
