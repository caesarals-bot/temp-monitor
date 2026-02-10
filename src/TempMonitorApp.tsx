import { BrowserRouter, Routes, Route } from "react-router";
import { LandingPage } from "@/pages/LandingPage";

function TempMonitorApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Aquí se agregarán más rutas en el futuro, e.g., /login, /dashboard */}
      </Routes>
    </BrowserRouter>
  );
}

export default TempMonitorApp;
