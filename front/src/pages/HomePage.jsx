// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:3001";

export default function HomePage() {
  const { user, logout, setUser } = useAuth(); // se setUser não existir, vai ser undefined
  const [showModal, setShowModal] = useState(false);

  const [nome, setNome] = useState(user?.nome || "");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function salvarPerfil() {
    try {
      setLoading(true);
      setMensagem("");

      const res = await fetch(`${API_URL}/user/${user.id_usuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          senha: senha || null, // se vazio, não altera a senha
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao atualizar perfil.");
      }

      setMensagem("Perfil atualizado com sucesso!");

      // Atualiza o contexto se o setUser existir
      if (setUser) {
        setUser({
          ...user,
          nome: nome,
        });
      }

      // limpa campo de senha
      setSenha("");
    } catch (err) {
      setMensagem(err.message);
    } finally {
      setLoading(false);
    }
  }

  function abrirModal() {
    setNome(user?.nome || "");
    setSenha("");
    setMensagem("");
    setShowModal(true);
  }

  function fecharModal() {
    setShowModal(false);
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Bem-vindo ao Gestor de Cursos
      </h1>

      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Escolha uma área no menu acima.
      </p>

      <button
        onClick={abrirModal}
        style={{
          padding: "0.75rem 1.5rem",
          background: "#1e40af",
          color: "white",
          borderRadius: "0.75rem",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: 500,
        }}
      >
        ⚙️ Editar Perfil
      </button>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              width: "100%",
              maxWidth: "450px",
            }}
          >
            <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
              Editar Perfil
            </h2>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: 6 }}>Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: 6 }}>
                Nova senha:
              </label>
              <input
                type="password"
                placeholder="Deixe em branco para não alterar"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                }}
              />
            </div>

            {mensagem && (
              <p style={{ marginBottom: "0.75rem", color: "#1e40af" }}>
                {mensagem}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <button
                onClick={fecharModal}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={salvarPerfil}
                disabled={loading}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 6,
                  border: "none",
                  background: "#1e40af",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
