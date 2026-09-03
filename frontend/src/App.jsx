import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AlunoPage from "./pages/AlunoPage";
import ProfessorPage from "./pages/ProfessorPage";
import AdminPage from "./pages/AdminPage";

function hasAluno(tipo) { return (tipo & 1) !== 0; }
function hasProfessor(tipo) { return (tipo & 2) !== 0; }
function hasAdmin(tipo) { return (tipo & 4) !== 0; }

function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const t = user.tipo || 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* NAVBAR */}
      <header style={{
        background: "#111827",
        color: "#ffffff",
        padding: "0.85rem 2rem",
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ fontWeight: "700", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🎓</span>
          <span>Gestor de Cursos</span>
        </div>

        <nav style={{ display: "flex", gap: "1.25rem", marginLeft: "1rem" }}>
          <Link
            to="/app"
            style={{
              color: location.pathname === "/app" ? "#60a5fa" : "#d1d5db",
              textDecoration: "none",
              fontWeight: 500
            }}
          >
            Início
          </Link>

          {hasAluno(t) && (
            <Link
              to="/aluno"
              style={{
                color: location.pathname === "/aluno" ? "#60a5fa" : "#d1d5db",
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              Aluno
            </Link>
          )}

          {hasProfessor(t) && (
            <Link
              to="/professor"
              style={{
                color: location.pathname === "/professor" ? "#60a5fa" : "#d1d5db",
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              Professor
            </Link>
          )}

          {hasAdmin(t) && (
            <Link
              to="/admin"
              style={{
                color: location.pathname === "/admin" ? "#60a5fa" : "#d1d5db",
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              Administrador
            </Link>
          )}
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            👤 {user.nome}
          </span>
          <button
            onClick={logout}
            style={{
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              padding: "0.4rem 0.85rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "0.85rem"
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* ROTAS INTERNAS */}
      <main style={{ flex: 1, background: "#f3f4f6" }}>
        <Routes>
          <Route path="/app" element={<HomePage />} />
          <Route path="/aluno" element={hasAluno(t) ? <AlunoPage /> : <Navigate to="/app" replace />} />
          <Route path="/professor" element={hasProfessor(t) ? <ProfessorPage /> : <Navigate to="/app" replace />} />
          <Route path="/admin" element={hasAdmin(t) ? <AdminPage /> : <Navigate to="/app" replace />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
}

export default App;
