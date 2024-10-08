import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import SocketContextProvider from "./providers/SocketContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </React.StrictMode>
);
