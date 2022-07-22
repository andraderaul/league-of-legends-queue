import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import { Login, AcceptMatch, Room, Lobby, ChampionSelect } from "./features";
import { login, createRoom, joinRoom, startQueue, stopQueue } from "./services";

const BASE_SOCKET_URI =
  import.meta.env.VITE_BASE_SOCKET_URI ?? "http://localhost:3001";

const socket = io(BASE_SOCKET_URI);

export type Status =
  | "initial"
  | "lobby"
  | "room"
  | "queue"
  | "accept-match"
  | "champion-select";

function App() {
  const [activePlayers, setActivePlayers] = useState(0);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<Status>("initial");
  const [player, setPlayer] = useState({});
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState({});
  const [sides, setSides] = useState<any>({});

  useEffect(() => {
    socket.on(`rooms-${roomName}`, (data) => {
      console.log(data);
      setRoom(data);
    });
  }, [roomName]);

  useEffect(() => {
    console.log("Start Connection");
    socket.on("active-players", (data) => {
      setActivePlayers(data);
    });
  }, []);

  useEffect(() => {
    socket.on("match", (data) => {
      console.log("we have a match");
      setSides(data);
      setStatus("accept-match");
      console.log(data);
    });
  });

  const handlerUserName = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const handlerLogin = useCallback(async () => {
    const response = await login({ username });

    setPlayer(response.data);
    console.log(response);
    if (response.data.id) {
      setStatus("lobby");
      socket.emit("check-in", response.data.id);
    }
  }, [username]);

  const handlerRoomName = useCallback((e) => {
    setRoomName(e.target.value);
  }, []);

  const handlerCreateRoom = useCallback(async () => {
    const response = await createRoom({
      playerId: player.id,
      roomName,
    });

    console.log(response);
    if (response.data.id) {
      setStatus("room");
    }
  }, [player.id, roomName]);

  const handlerJoinRoom = useCallback(async () => {
    const response = await joinRoom({
      playerId: player.id,
      roomName,
    });

    console.log(response);
    if (response.data.id) {
      setStatus("room");
    }
  }, [player.id, roomName]);

  const handlerOnStartQueue = useCallback(async () => {
    const response = await startQueue({ roomName });

    console.log(response);
    if (response.data.inQueue) {
      setStatus("queue");
    }
  }, [roomName]);

  const handlerOnStopQueue = useCallback(async () => {
    const response = await stopQueue({ roomName });

    console.log(response);
    if (!response.data.inQueue) {
      setStatus("room");
    }
  }, [roomName]);

  const handlerOnMatch = useCallback(async () => {
    const response = await stopQueue({ roomName });

    console.log(response);
    if (response.data.id) {
      setStatus("champion-select");
    }
  }, [roomName]);

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
        <Login onChange={handlerUserName} onClick={handlerLogin} />
      )}
      {status === "lobby" && (
        <Lobby
          username={username}
          onChange={handlerRoomName}
          onCreateRoom={handlerCreateRoom}
          onJoinRoom={handlerJoinRoom}
        />
      )}
      {(status === "room" ||
        status === "queue" ||
        status === "accept-match") && (
        <Room
          room={room}
          player={player}
          onStopQueue={handlerOnStopQueue}
          onStartQueue={handlerOnStartQueue}
          status={status}
        />
      )}

      {status === "accept-match" && <AcceptMatch onMatch={handlerOnMatch} />}
      {status === "champion-select" && <ChampionSelect sides={sides} />}
    </div>
  );
}

export default App;
