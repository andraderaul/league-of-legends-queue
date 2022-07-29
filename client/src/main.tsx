import "./index.css";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketContext, StatusContext } from "./context";
import { Status } from "./context/status";
import { socketClient } from "./services";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

const AppProvider = () => {
  const [status, setStatus] = useState<Status>("initial");

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      <QueryClientProvider client={queryClient}>
        <SocketContext.Provider value={socketClient}>
          <App />
          <Toaster
            toastOptions={{
              error: {
                style: {
                  background: "red",
                  color: "white",
                },
              },
            }}
          />
        </SocketContext.Provider>
      </QueryClientProvider>
    </StatusContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>
);
