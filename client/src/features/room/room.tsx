import Avatar from "boring-avatars";
import { useCallback, useContext, useMemo } from "react";
import { StatusContext } from "../../context";
import { useStartQueueMutation, useStopQueueMutation } from "../../hooks";

type RoomProps = {
  room: {
    name: string;
    owner: string;
    inQueue: boolean;
    players?: Array<{
      id: string;
      name: string;
      rank: number;
    }>;
  };
  player: {
    id: string;
  };
};

export const Room = ({ room, player }: RoomProps) => {
  const { status } = useContext(StatusContext);

  const { mutate: startMutate } = useStartQueueMutation();
  const { mutate: stopMutate } = useStopQueueMutation();

  const buttonName = useMemo(
    () => (status === "queue" ? "Stop" : "Start"),
    [status]
  );

  const buttonColor = useMemo(
    () => (status === "queue" ? "red" : "green"),
    [status]
  );

  const onAction = useCallback(
    () =>
      status === "queue"
        ? stopMutate({
            roomName: room.name,
          })
        : startMutate({
            roomName: room.name,
          }),
    [room.name, startMutate, status, stopMutate]
  );

  return (
    <div
      className={`min-h-fit flex flex-col items-center ${
        status === "accept-match" ? "blur-md" : ""
      }`}
    >
      <div className="flex items-end m-8">
        <p className="text-3xl text-yellow-500 mr-1 font-light">
          You are in Room:
        </p>
        <p className="text-5xl text-yellow-500 font-semibold"> {room.name}!</p>
      </div>
      <div className="">
        <p className="text-lg text-white text-4xl font-light">Players:</p>
        {room.players?.map((p) => (
          <div
            key={p.id}
            className={`flex items-center m-4 p-2 bg-slate-900 rounded-md border-l-4
             ${room.owner === p.id ? "border-yellow-500" : "border-blue-900"}`}
          >
            <div className="hover:scale-105 transition-transform ease-linear m-2">
              <Avatar
                size={80}
                variant="beam"
                name={p.id}
                colors={["#E1E6E3", "#BFD6C7", "#C7BD93", "#FF7876", "#574B45"]}
              />
            </div>
            <p className="w-52 truncate text-2xl text-yellow-500">{p.name}</p>
          </div>
        ))}
      </div>

      {room.owner === player.id && (
        <button
          className={`mr-2 bg-${buttonColor}-500 rounded-lg
        w-1/2 h-10 text-white 
        hover:bg-${buttonColor}-600 hover:scale-110 
        transition-transform ease-linear`}
          onClick={onAction}
          disabled={player.id !== room.owner}
        >
          {buttonName}
        </button>
      )}
    </div>
  );
};
