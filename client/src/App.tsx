import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/styles/index.scss";

const LobbyPage = lazy(() => import("@/pages/LobbyPage/LobbyPage"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lobby" element={<LobbyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
