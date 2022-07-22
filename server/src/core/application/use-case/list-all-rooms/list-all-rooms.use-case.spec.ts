import crypto from "crypto";
import { RoomInMemoryRepository } from "../../../infra/db";
import { CreateRoomUseCase } from "../create-room";
import { ListAllRoomsUseCase } from "./list-all-rooms.use-case";

describe("Testing ListAllRoomsUseCase", () => {
  it("should list all rooms", async () => {
    const repository = new RoomInMemoryRepository();
    const input = {
      name: "Room X",
      players: [
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ],
      owner: crypto.randomUUID(),
    };
    const createUseCase = new CreateRoomUseCase(repository);
    await createUseCase.execute(input);
    await createUseCase.execute(input);
    await createUseCase.execute(input);

    const listAllUseCase = new ListAllRoomsUseCase(repository);
    const [error, output] = await listAllUseCase.execute();
    expect(error).toBeNull();
    expect(output).toHaveLength(3);
    expect(output).toMatchObject([input, input, input]);
  });
});
