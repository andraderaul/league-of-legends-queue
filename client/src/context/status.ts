import React from "react";

export type Status =
  | "initial"
  | "lobby"
  | "room"
  | "queue"
  | "accept-match"
  | "champion-select";

type StatusContextProps = {
  status: Status;
  setStatus?: (status: Status) => void;
};

const InitialValues: StatusContextProps = {
  status: "initial",
};

export const StatusContext = React.createContext(InitialValues);
