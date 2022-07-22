import { PlayerInMemoryRepository } from "../../../infra/db";
import { CreatePlayerUseCase } from "./create-player.use-case";

describe("Testing CreatePlayerUseCase", () => {
  it("should create a new player", async () => {
    const repository = new PlayerInMemoryRepository();
    const createUseCase = new CreatePlayerUseCase(repository);
    const input = {
      name: "player y",
      rank: 1,
    };
    const [error, output] = await createUseCase.execute(input);
    expect(error).toBeNull();
    expect(repository.items).toHaveLength(1);
    expect(output).toMatchObject(input);
  });
});
