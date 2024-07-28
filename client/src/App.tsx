import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/styles/index.scss";

const LobbyPage = lazy(() => import("@/pages/LobbyPage/LobbyPage"));
const RoomPage = lazy(() => import("@/pages/RoomPage/RoomPage"));

const App = function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lobby" element={<LobbyPage />} />

        <Route path="/room" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
