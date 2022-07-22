import crypto from "crypto";
import { RoomInMemoryRepository } from "../../../infra/db";
import { StartQueueUseCase } from "./start-queue.use-case";
import { CreateRoomUseCase } from "../create-room";

describe("Testing JoinQueueUseCase", () => {
  it("should be able a room starts a queue", async () => {
    const repository = new RoomInMemoryRepository();
    const createUseCase = new CreateRoomUseCase(repository);
    const player1 = crypto.randomUUID();
    await createUseCase.execute({
      name: "room y",
      players: [player1],
    });
    const player2 = crypto.randomUUID();
    await createUseCase.execute({
      name: "room x",
      players: [player2],
    });

    const input = { name: "room x" };
    const startQueueUseCase = new StartQueueUseCase(repository);
    const [error, output] = await startQueueUseCase.execute(input);

    expect(repository.items).toHaveLength(2);
    expect(error).toBeNull();
    expect(output).toMatchObject({
      name: "room x",
      players: [player2],
      owner: player2,
      inQueue: true,
    });
  });

  it("should return error when not found a room", async () => {
    const repository = new RoomInMemoryRepository();
    const startQueueUseCase = new StartQueueUseCase(repository);

    const input = {
      name: "room Z",
    };

    const [error, output] = await startQueueUseCase.execute(input);
    expect(output).toBeNull();
    expect(error?.message).toBe("Not found room with name room Z");
  });
});
