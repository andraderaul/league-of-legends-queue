import { PlayerInMemoryRepository } from "../../../infra/db";
import { CreatePlayerUseCase } from "../create-player";
import { ListAllPlayersUseCase } from "./list-all-players.use-case";

describe("Testing ListAllPlayerUseCase", () => {
  it("should list all players", async () => {
    const repository = new PlayerInMemoryRepository();
    const input = {
      name: "player y",
      rank: 1,
    };
    const createUseCase = new CreatePlayerUseCase(repository);
    await createUseCase.execute(input);
    await createUseCase.execute(input);
    await createUseCase.execute(input);

    const listAllUseCase = new ListAllPlayersUseCase(repository);
    const [error, output] = await listAllUseCase.execute();
    expect(error).toBeNull();
    expect(output).toHaveLength(3);
    expect(output).toMatchObject([input, input, input]);
  });
});
