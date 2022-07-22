import crypto from "crypto";
import { RoomInMemoryRepository } from "../../../infra/db";
import { StopQueueUseCase } from "./stop-queue.use-case";
import { CreateRoomUseCase } from "../create-room";

describe("Testing StopQueueUseCase", () => {
  it("should be able a room stops a queue", async () => {
    const repository = new RoomInMemoryRepository();
    const createUseCase = new CreateRoomUseCase(repository);
    const player1 = crypto.randomUUID();
    await createUseCase.execute({
      name: "room y",
      players: [player1],
      inQueue: true,
    });
    const player2 = crypto.randomUUID();
    await createUseCase.execute({
      name: "room x",
      players: [player2],
      inQueue: true,
    });

    const input = { name: "room x" };
    const stopQueueUseCase = new StopQueueUseCase(repository);
    const [error, output] = await stopQueueUseCase.execute(input);

    expect(repository.items).toHaveLength(2);
    expect(error).toBeNull();
    expect(output).toMatchObject({
      name: "room x",
      players: [player2],
      owner: player2,
      inQueue: false,
    });
  });

  it("should return error when not found a room", async () => {
    const repository = new RoomInMemoryRepository();
    const stopQueueUseCase = new StopQueueUseCase(repository);

    const input = {
      name: "room Z",
    };

    const [error, output] = await stopQueueUseCase.execute(input);

    expect(output).toBeNull();
    expect(error?.message).toBe("Not found room with name room Z");
  });
});
