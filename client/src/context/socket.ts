import React from "react";
import { socketClient } from "../services";

export const SocketContext = React.createContext(socketClient);
