import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import toast from "react-hot-toast";
import { SocketContext, StatusContext } from "../context";
import {
  createRoom,
  joinRoom,
  login,
  startQueue,
  stopQueue,
  createMatch,
} from "../services";

export const useLoginMutation = () => {
  const socket = useContext(SocketContext);
  const { setStatus } = useContext(StatusContext);

  const { mutate, status, data, error } = useMutation(
    ({ username }: { username: string }) => login({ username }),
    {
      onSuccess: ({ data }) => {
        if (data?.id) {
          setStatus?.("lobby");
          socket.emit("check-in", data?.id);
        }
      },
      onError: ({ response: { data } }) => {
        toast.error(data.message);
      },
    }
  );

  return {
    mutate,
    status,
    data: data?.data,
    error,
  };
};

export const useCreateRoomMutation = () => {
  const { setStatus } = useContext(StatusContext);

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
        if (data?.id) {
          setStatus?.("room");
        }
      },
      onError: ({ response: { data } }) => {
        toast.error(data.message);
      },
    }
  );

  return {
    mutate,
    status,
    data: data?.data,
    error,
  };
};

export const useMatchMutation = () => {
  const { setStatus } = useContext(StatusContext);
  type MutateLogin = {
    roomName: string;
    playerId: string;
    side: string;
    matchId: string;
  };
  const { mutate, status, data, error } = useMutation(
    ({ roomName, playerId, matchId, side }: MutateLogin) =>
      createMatch({ roomName, playerId, matchId, side }),
    {
      onSuccess: ({ data }) => {
        if (data.id) {
          setStatus?.("champion-select");
        }
      },
      onError: ({ response: { data } }) => {
        toast.error(data.message);
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

export const useStartQueueMutation = () => {
  const socket = useContext(SocketContext);
  const { setStatus } = useContext(StatusContext);
  const { mutate, status, data, error } = useMutation(
    ({ roomName }: { roomName: string }) => startQueue({ roomName }),
    {
      onSuccess: ({ data }) => {
        if (data?.inQueue) {
          setStatus?.("queue");
          socket.emit("start-queue");
        }
      },
      onError: ({ response: { data } }) => {
        toast.error(data.message);
      },
    }
  );

  return {
    mutate,
    status,
    data: data?.data,
    error,
  };
};

export const useStopQueueMutation = () => {
  const socket = useContext(SocketContext);
  const { setStatus } = useContext(StatusContext);
  const { mutate, status, data, error } = useMutation(
    ({ roomName }: { roomName: string }) => stopQueue({ roomName }),
    {
      onSuccess: ({ data }) => {
        if (!data?.inQueue) {
          setStatus?.("room");
          socket.emit("stop-queue");
        }
      },
      onError: ({ response: { data } }) => {
        toast.error(data.message);
      },
    }
  );

  return {
    mutate,
    status,
    data: data?.data,
    error,
  };
};
