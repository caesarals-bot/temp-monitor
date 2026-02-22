import { BrowserRouter } from "react-router";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppRouter } from "@/router/AppRouter";

function TempMonitorApp() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default TempMonitorApp;
