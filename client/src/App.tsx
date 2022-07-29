import { useContext } from "react";
import { StatusContext } from "./context";
import {
  Login,
  AcceptMatch,
  Room,
  Lobby,
  ChampionSelect,
  ActivePlayers,
} from "./features";
import {
  useCreateRoomMutation,
  useLoginMutation,
  useMatch,
  useRoom,
  useMatchMutation,
} from "./hooks";

function App() {
  const { status } = useContext(StatusContext);
  const { data: sides } = useMatch();

  const { mutate: roomMutate, data: createRoom } = useCreateRoomMutation();
  const { data: room } = useRoom({
    roomName: createRoom?.name,
  });
  const { mutate: matchMutate } = useMatchMutation();
  const { mutate: mutateLogin, data: player } = useLoginMutation();

  console.log({ status, room, createRoom });

  return (
    <div
      className={`min-w-full min-h-screen	bg-slate-800 flex justify-center ${
        status === "initial" || status === "lobby" || status === "accept-match"
          ? "items-center"
          : "items-start"
      }`}
    >
      {status !== "initial" && <ActivePlayers />}
      {status === "initial" && <Login handlerLogin={mutateLogin} />}
      {status === "lobby" && (
        <Lobby
          player={player}
          onCreateRoom={roomMutate}
          onJoinRoom={roomMutate}
        />
      )}
      {(status === "room" ||
        status === "queue" ||
        status === "accept-match") && (
        <Room room={room ?? createRoom} player={player} />
      )}

      {status === "accept-match" && (
        <AcceptMatch
          onMatch={() => {
            matchMutate({ roomName: createRoom?.name });
          }}
        />
      )}
      {status === "champion-select" && <ChampionSelect sides={sides} />}
    </div>
  );
}

export default App;
