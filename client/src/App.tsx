import { useCallback, useState } from "react";
import { Login, AcceptMatch, Room, Lobby, ChampionSelect } from "./features";
import {
  useActivePlayers,
  useCreateRoomMutation,
  useLoginMutation,
  useMatch,
  useRoom,
  useStartQueueMutation,
  useStopQueueMutation,
  useMatchMutation,
} from "./hooks";

export type Status =
  | "initial"
  | "lobby"
  | "room"
  | "queue"
  | "accept-match"
  | "champion-select";

function App() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<Status>("initial");
  const [roomName, setRoomName] = useState("");
  // const [sides, setSides] = useState<any>({});

  const { mutate: loginMutate, data: player } = useLoginMutation({
    setStatus,
  });
  const { mutate: roomMutate } = useCreateRoomMutation({ setStatus });
  const { mutate: startMutate } = useStartQueueMutation({ setStatus });
  const { mutate: stopMutate } = useStopQueueMutation({ setStatus });
  const { mutate: matchMutate } = useMatchMutation({ setStatus });

  const { data: room } = useRoom({
    roomName,
  });
  const { data: activePlayers } = useActivePlayers();
  const { data: sides } = useMatch({ setStatus });

  console.log({ status });

  const handlerUserName = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const handlerRoomName = useCallback((e) => {
    setRoomName(e.target.value);
  }, []);

  return (
    <div
      className={`min-w-full min-h-screen	bg-slate-800 flex justify-center ${
        status === "initial" || status === "lobby" || status === "accept-match"
          ? "items-center"
          : "items-start"
      }`}
    >
      {status !== "initial" && (
        <div className="fixed top-8 right-8">
          <span className="text-xl font-light text-yellow-500 mr-1">
            Active Players:
          </span>
          <span className="text-2xl font-semibold text-green-500">
            {activePlayers}
          </span>
        </div>
      )}
      {status === "initial" && (
        <Login
          onChange={handlerUserName}
          onClick={() => {
            loginMutate({ username });
          }}
        />
      )}
      {status === "lobby" && (
        <Lobby
          username={username}
          onChange={handlerRoomName}
          onCreateRoom={() => {
            roomMutate({
              playerId: player?.id,
              roomName,
            });
          }}
          onJoinRoom={() => {
            roomMutate({
              playerId: player?.id,
              roomName,
              isJoin: true,
            });
          }}
        />
      )}
      {(status === "room" ||
        status === "queue" ||
        status === "accept-match") && (
        <Room
          room={room}
          player={player}
          onStopQueue={() => {
            stopMutate({ roomName });
          }}
          onStartQueue={() => {
            startMutate({ roomName });
          }}
          status={status}
        />
      )}

      {status === "accept-match" && (
        <AcceptMatch
          onMatch={() => {
            matchMutate({ roomName });
          }}
        />
      )}
      {status === "champion-select" && <ChampionSelect sides={sides} />}
    </div>
  );
}

export default App;
