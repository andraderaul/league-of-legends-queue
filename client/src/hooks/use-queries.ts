import { useQuery, useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { SocketContext } from "../context";
import {
  createRoom,
  joinRoom,
  login,
  startQueue,
  stopQueue,
} from "../services";

export const useLoginMutation = ({ setStatus }: { setStatus: any }) => {
  const socket = useContext(SocketContext);

  const { mutate, status, data, error } = useMutation(
    ({ username }: { username: string }) => login({ username }),
    {
      onSuccess: ({ data }) => {
        console.log(data);
        if (data?.id) {
          setStatus("lobby");
          socket.emit("check-in", data?.id);
        }
      },
      onError: () => {
        console.error("Login deu ruim");
      },
    }
  );

  return {
    mutate,
    status,
    data: data?.data ?? {},
    error,
  };
};

export const useCreateRoomMutation = ({ setStatus }: { setStatus: any }) => {
  const { mutate, status, data, error } = useMutation(
    ({
      playerId,
      roomName,
      isJoin,
    }: {
      playerId: string;
      roomName: string;
      isJoin?: boolean;
    }) =>
      isJoin
        ? joinRoom({ playerId, roomName })
        : createRoom({ playerId, roomName }),
    {
      onSuccess: ({ data }) => {
        console.log(data);
        if (data?.id) {
          setStatus("room");
        }
      },
      onError: () => {
        console.error("Deu room");
      },
    }
  );

  return {
    mutate,
    status,
    data: data?.data ?? {},
    error,
  };
};

export const useMatchMutation = ({ setStatus }: { setStatus: any }) => {
  const { mutate, status, data, error } = useMutation(
    ({ roomName }: { roomName: string }) => stopQueue({ roomName }),
    {
      onSuccess: ({ data }) => {
        if (data.id) {
          setStatus("champion-select");
        }
      },
      onError: () => {
        console.error("Use match deu ruim");
      },
    }
  );

  return {
    mutate,
    status,
    data: data?.data ?? {},
    error,
  };
};

export const useRoom = ({ roomName }: { roomName: string }) => {
  const socket = useContext(SocketContext);
  const [room, setRoom] = useState({});

  useQuery(["room", roomName], () => {
    console.log("Listening Room");
    return socket.on(`rooms-${roomName}`, (data) => {
      setRoom(data);
    });
  });

  return { data: room };
};

export const useActivePlayers = () => {
  const [activePlayers, setActivePlayers] = useState(0);
  const socket = useContext(SocketContext);

  useQuery(["active", "players"], () => {
    console.log("Start Connection");
    return socket.on("active-players", (data) => {
      setActivePlayers(data);
    });
  });

  return {
    data: activePlayers,
  };
};

export const useStartQueueMutation = ({ setStatus }: { setStatus: any }) => {
  const { mutate, status, data, error } = useMutation(
    ({ roomName }: { roomName: string }) => startQueue({ roomName }),
    {
      onSuccess: ({ data }) => {
        console.log(data);
        if (data?.inQueue) {
          setStatus("queue");
        }
      },
      onError: () => {
        console.error("Start Queue deu ruim");
      },
    }
  );

  return {
    mutate,
    status,
    data: data?.data ?? {},
    error,
  };
};

export const useStopQueueMutation = ({ setStatus }: { setStatus: any }) => {
  const { mutate, status, data, error } = useMutation(
    ({ roomName }: { roomName: string }) => stopQueue({ roomName }),
    {
      onSuccess: ({ data }) => {
        console.log(data);
        if (!data?.inQueue) {
          setStatus("room");
        }
      },
      onError: () => {
        console.error("Stop Queue deu ruim");
      },
    }
  );

  return {
    mutate,
    status,
    data: data?.data ?? {},
    error,
  };
};

export const useMatch = ({ setStatus }: { setStatus: any }) => {
  const [sides, setSides] = useState<any>({});
  const socket = useContext(SocketContext);

  useQuery(["match"], () => {
    console.log("Listening Match");
    return socket.on("match", (data) => {
      console.log("We have a match");
      console.log(data);
      setStatus("accept-match");
      setSides(data);
    });
  });

  return {
    data: sides,
  };
};
