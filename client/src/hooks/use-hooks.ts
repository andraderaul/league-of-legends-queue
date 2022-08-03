import { useContext, useState, useEffect } from "react";
import { SocketContext, StatusContext } from "../context";
import { Room, Side } from "../types";

type UseRoomProps = { roomName?: string };

export const useRoom = ({ roomName }: UseRoomProps) => {
  const socket = useContext(SocketContext);
  const [room, setRoom] = useState<Room | undefined>(undefined);

  useEffect(() => {
    console.log("Listening Room");
    if (roomName) {
      socket.on(`rooms-${roomName}`, (data) => {
        console.log(data);
        setRoom(data);
      });
    }
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

type UseMatchData = {
  side: "BLUE" | "RED";
  id: string;
};
type UseMatch = () => {
  data: undefined | UseMatchData;
};
export const useMatch: UseMatch = () => {
  const { setStatus } = useContext(StatusContext);
  const [data, setData] = useState<UseMatchData | undefined>();
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log("Listening Match");
    socket.on("match", (matchData) => {
      console.log("We have a match");
      setStatus?.("accept-match");
      setData(matchData);
    });
  }, [setStatus, socket]);

  return {
    data,
  };
};

type UseAcceptMatchData = {
  blueSide: Side;
  redSide: Side;
};
type UseAcceptMatch = () => {
  data: undefined | UseAcceptMatchData;
};
export const useAcceptMatch: UseAcceptMatch = () => {
  const { setStatus } = useContext(StatusContext);
  const [data, setData] = useState<UseAcceptMatchData>();
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log("Listening Accept Match");
    socket.on("accept-match", (matchData) => {
      setData(matchData);
    });
  }, [setStatus, socket]);

  return {
    data,
  };
};
