import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";


import HomePage from "./pages/HomePage";

function hasAluno(tipo) { return (tipo & 1) !== 0 }
function hasProfessor(tipo) { return (tipo & 2) !== 0 }
function hasAdmin(tipo) { return (tipo & 4) !== 0 }

function AppLayout() {
  const { user, logout } = useAuth();
  const t = user.tipo;

  return (
    <div>

      {/* NAVBAR */}
      <header style={{ background: "#111827", color: "#fff", padding: "1rem 2rem", display: "flex", gap: "1rem" }}>
        <Link to="/app" style={{ color: "#fff" }}>Home</Link>

        {hasAluno(t) && <Link to="/aluno" style={{ color: "#fff" }}>Aluno</Link>}
        {hasProfessor(t) && <Link to="/professor" style={{ color: "#fff" }}>Professor</Link>}
        {hasAdmin(t) && <Link to="/admin" style={{ color: "#fff" }}>Administrador</Link>}

        <button onClick={logout} style={{
          marginLeft: "auto",
          background: "#dc2626",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          cursor: "pointer"
        }}>
          Sair
        </button>
      </header>

      {/* ROTAS INTERNAS */}
      <Routes>

        <Route path="/app" element={<HomePage />} />


      </Routes>
    </div>
  );
}


export default App;
