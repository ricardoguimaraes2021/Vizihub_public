import { Navigate } from "react-router-dom";
import Login from "../app/(auth)/login/page";
import { useAuth } from "../hooks/useAuth";

const AuthRedirect = () => {
  console.log("📢 AuthRedirect renderizado!"); // Verificação


  const isAuthenticated = useAuth();

  console.log("📢 AuthRedirect Renderizado!");
  console.log("🔍 Estado de autenticação dentro do AuthRedirect:", isAuthenticated);

  if (isAuthenticated === null) return null;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />;
};

export default AuthRedirect;
