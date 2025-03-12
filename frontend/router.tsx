import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthRedirect from "./components/AuthRedirect"; // Certifica-te que o caminho está correto
import Dashboard from "./app/(dashboard)/dashboard/page";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

const AppRouter = () => {
  console.log("🚀 AppRouter renderizado!"); // Verificação

  const isAuthenticated = useAuth();

  useEffect(() => {
    console.log("🔄 Estado final da autenticação:", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Certifica-te de que o login está a usar `AuthRedirect` corretamente */}
        <Route path="/login" element={<AuthRedirect />} />

        {/* Protege a rota do dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Redireciona qualquer rota inválida para a página de login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
