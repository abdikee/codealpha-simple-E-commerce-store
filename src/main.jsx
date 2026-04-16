import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import { AuthProvider } from "./app/context/AuthContext.jsx";
import { Toaster } from "./app/components/ui/toaster.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
    <Toaster />
  </AuthProvider>
);
