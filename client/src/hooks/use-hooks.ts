import { useContext, useState, useEffect } from "react";
import { SocketContext, StatusContext } from "../context";

type UseRoomProps = { roomName: string };

export const useRoom = ({ roomName }: UseRoomProps) => {
  const socket = useContext(SocketContext);
  const [room, setRoom] = useState(undefined);

  useEffect(() => {
    console.log("Listening Room");
    socket.on(`rooms-${roomName}`, (data) => {
      console.log(data);
      setRoom(data);
    });
  }, [room, roomName, socket]);

  return { data: room };
};

export const useActivePlayers = () => {
  const [activePlayers, setActivePlayers] = useState(0);
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log("Start Connection");
    socket.on("active-players", (data) => {
      setActivePlayers(data);
    });
  }, [socket]);

  return {
    data: activePlayers,
  };
};

export const useMatch = () => {
  const { setStatus } = useContext(StatusContext);
  const [sides, setSides] = useState<any>({});
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log("Listening Match");
    socket.on("match", (data) => {
      console.log("We have a match");
      setStatus?.("accept-match");
      setSides(data);
    });
  }, [setStatus, socket]);

  return {
    data: sides,
  };
};
