import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  if (user) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await login(cpf, senha);
      navigate("/app");
    } catch (err) {
      setErro(err.message || "Falha na autenticação");
    } finally {
      setCarregando(false);
    }
  };

  const preencherCredenciais = (cpfExemplo, senhaExemplo) => {
    setCpf(cpfExemplo);
    setSenha(senhaExemplo);
    setErro("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f3f4f6",
      padding: "1rem"
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "1rem",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "420px",
        padding: "2rem"
      }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#111827", margin: "0 0 0.5rem 0" }}>
            Gestor de Cursos
          </h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "0.95rem" }}>
            Acesse o portal com seu CPF e senha
          </p>
        </div>

        {erro && (
          <div style={{
            background: "#fee2e2",
            border: "1px solid #f87171",
            color: "#991b1b",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
            fontSize: "0.9rem"
          }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.25rem" }}>
              CPF (11 dígitos):
            </label>
            <input
              type="text"
              required
              maxLength={11}
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
              placeholder="00000000000"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.25rem" }}>
              Senha:
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: carregando ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
          >
            {carregando ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", borderTop: "1px solid #e5e7eb", paddingTop: "1.25rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "0 0 0.75rem 0", fontWeight: "600" }}>
            Contas de Teste Rápidas (clique para preencher):
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => preencherCredenciais("00000000000", "admin123")}
              style={{
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                textAlign: "left",
                fontSize: "0.825rem",
                cursor: "pointer"
              }}
            >
              🛡️ <strong>Admin</strong> (CPF: 00000000000 / admin123)
            </button>
            <button
              type="button"
              onClick={() => preencherCredenciais("11111111111", "prof123")}
              style={{
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                textAlign: "left",
                fontSize: "0.825rem",
                cursor: "pointer"
              }}
            >
              👨‍🏫 <strong>Professor</strong> (CPF: 11111111111 / prof123)
            </button>
            <button
              type="button"
              onClick={() => preencherCredenciais("22222222222", "aluno123")}
              style={{
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                textAlign: "left",
                fontSize: "0.825rem",
                cursor: "pointer"
              }}
            >
              🎓 <strong>Aluno</strong> (CPF: 22222222222 / aluno123)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
