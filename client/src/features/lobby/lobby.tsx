import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useCallback, useState } from "react";
import { Player, Room } from "../../types";

type MutateParams = {
  playerId: string;
  roomName: string;
  isJoin?: boolean | undefined;
};

type MutateResponse = {
  response: {
    data: Room;
  };
};

type onMutate = UseMutateFunction<
  AxiosResponse<Room, any>,
  MutateResponse,
  MutateParams,
  unknown
>;

type LobbyProps = {
  player?: Player;
  onCreateRoom: onMutate;
  onJoinRoom: onMutate;
};

export const Lobby = ({ player, onCreateRoom, onJoinRoom }: LobbyProps) => {
  const [roomName, setRoomName] = useState("");

  const handlerRoomName = useCallback((e: any) => {
    setRoomName(e.target.value);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex items-end">
        <p className="text-3xl font-light text-yellow-500 mr-1">Welcome </p>
        <p className="text-5xl text-yellow-500"> {player?.name}!</p>
      </div>
      <input
        type="text"
        className="mt-8 mb-4 px-3 py-2 bg-white border shadow-sm 
        border-slate-200 placeholder-slate-300 focus:outline-none 
        focus:border-yellow-500 focus:ring-yellow-500 block rounded-md sm:text-sm focus:ring-1"
        onChange={handlerRoomName}
        placeholder="Enter a room name"
      />
      <div>
        <button
          className="mr-2 p-4 bg-green-500 rounded-lg
          w-26 h-20 text-white text-xl
          hover:bg-green-600 hover:scale-110 
          transition-transform ease-linear"
          onClick={() => {
            onCreateRoom({
              playerId: player?.id ?? "",
              roomName: roomName,
            });
          }}
        >
          Create a room
        </button>
        <button
          className="ml-2 p-4 bg-blue-500 rounded-lg
          w-26 h-20 text-white text-xl
          hover:bg-blue-600 hover:scale-110 
          transition-transform ease-linear"
          onClick={() =>
            onJoinRoom({
              playerId: player?.id ?? "",
              roomName: roomName,
              isJoin: true,
            })
          }
        >
          Join in a room
        </button>
      </div>
    </div>
  );
};
