import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, setUser, API_URL } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const [nome, setNome] = useState(user?.nome || "");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const t = user?.tipo || 0;
  const isAluno = (t & 1) !== 0;
  const isProfessor = (t & 2) !== 0;
  const isAdmin = (t & 4) !== 0;

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
          senha: senha || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao atualizar perfil.");
      }

      setMensagem("Perfil atualizado com sucesso!");

      if (setUser) {
        setUser({
          ...user,
          nome: nome,
        });
      }

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: "0 0 0.5rem 0", color: "#111827" }}>
            Olá, {user?.nome}!
          </h1>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Seja bem-vindo ao Gestor de Cursos. Acesse suas áreas autorizadas abaixo:
          </p>
        </div>
        <button
          onClick={abrirModal}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#ffffff",
            color: "#374151",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 500,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        >
          ⚙️ Editar Perfil
        </button>
      </div>

      {/* CARDS DE ACESSO RÁPIDO */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {isAluno && (
          <Link to="/aluno" style={{ textDecoration: "none" }}>
            <div style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: "transform 0.1s"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎓</div>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#1e40af", fontSize: "1.25rem" }}>Área do Aluno</h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
                Ver disciplinas matriculadas, notas (P1, P2, PF), histórico e solicitar inscrição em turmas abertas.
              </p>
            </div>
          </Link>
        )}

        {isProfessor && (
          <Link to="/professor" style={{ textDecoration: "none" }}>
            <div style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              cursor: "pointer"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👨‍🏫</div>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#1e40af", fontSize: "1.25rem" }}>Área do Professor</h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
                Acompanhar turmas atribuídas, visualizar lista de alunos matriculados e realizar o lançamento de notas.
              </p>
            </div>
          </Link>
        )}

        {isAdmin && (
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <div style={{
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              cursor: "pointer"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛡️</div>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#1e40af", fontSize: "1.25rem" }}>Administração</h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
                Gerenciar usuários, criar novos cursos, cadastrar períodos letivos e abrir/fechar turmas.
              </p>
            </div>
          </Link>
        )}
      </div>

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
