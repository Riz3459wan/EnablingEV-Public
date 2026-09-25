import { AuthProvider } from "./auth/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <AppRoutes />
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
