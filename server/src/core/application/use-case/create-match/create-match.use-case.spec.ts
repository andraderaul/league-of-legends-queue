import crypto from "crypto";
import { MatchInMemoryRepository } from "../../../infra/db";
import { CreateMatchUseCase } from "./create-match.use-case";

describe("Testing CreateMatchUseCase", () => {
  it("should create a new match", async () => {
    const repository = new MatchInMemoryRepository();
    const createUseCase = new CreateMatchUseCase(repository);
    const input = {
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
    const [error, output] = await createUseCase.execute(input);
    expect(error).toBeNull();
    expect(repository.items).toHaveLength(1);
    expect(output).toMatchObject(input);
  });
});
