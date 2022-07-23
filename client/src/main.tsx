import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketContext } from "./context";
import { socketClient } from "./services";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketContext.Provider value={socketClient}>
        <App />
      </SocketContext.Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
