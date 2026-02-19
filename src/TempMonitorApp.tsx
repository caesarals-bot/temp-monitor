import { BrowserRouter } from "react-router";
import { AppProvider } from "@/context/AppContext";
import { AppRouter } from "@/router/AppRouter";

function TempMonitorApp() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProvider>
  );
}

export default TempMonitorApp;
