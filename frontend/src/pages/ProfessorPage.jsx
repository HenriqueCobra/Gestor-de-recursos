import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfessorPage() {
  const { user, API_URL } = useAuth();
  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [alunosTurma, setAlunosTurma] = useState([]);
  const [notas, setNotas] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregarTurmas = async () => {
    try {
      setCarregando(true);
      const res = await fetch(`${API_URL}/turma?professor=${user.id_usuario}`);
      const data = await res.json();
      setTurmas(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0) {
        selecionarTurma(data[0]);
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao carregar turmas do professor");
    } finally {
      setCarregando(false);
    }
  };

  const selecionarTurma = async (turma) => {
    setTurmaSelecionada(turma);
    setMensagem("");
    try {
      const res = await fetch(`${API_URL}/aluno_curso/turma/${turma.id_turma}`);
      const alunos = await res.json();
      setAlunosTurma(Array.isArray(alunos) ? alunos : []);

      // Preenche estado de notas
      const notasIniciais = {};
      alunos.forEach(a => {
        notasIniciais[a.id_aluno_curso] = {
          p1: a.p1 ?? "",
          p2: a.p2 ?? "",
          pf: a.pf ?? ""
        };
      });
      setNotas(notasIniciais);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao buscar alunos da turma");
    }
  };

  useEffect(() => {
    if (user?.id_usuario) {
      carregarTurmas();
    }
  }, [user]);

  const handleNotaChange = (id_aluno_curso, campo, valor) => {
    setNotas(prev => ({
      ...prev,
      [id_aluno_curso]: {
        ...prev[id_aluno_curso],
        [campo]: valor
      }
    }));
  };

  const salvarNotas = async (id_aluno_curso) => {
    try {
      setMensagem("");
      const n = notas[id_aluno_curso] || {};
      const res = await fetch(`${API_URL}/aluno_curso/${id_aluno_curso}/notas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          p1: n.p1 !== "" ? parseFloat(n.p1) : null,
          p2: n.p2 !== "" ? parseFloat(n.p2) : null,
          pf: n.pf !== "" ? parseFloat(n.pf) : null,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar notas");

      setMensagem("Notas atualizadas com sucesso! O cálculo da média foi acionado.");
      // Recarrega lista de alunos da turma
      selecionarTurma(turmaSelecionada);
    } catch (err) {
      setMensagem(err.message);
    }
  };

  if (carregando) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Carregando painel do professor...</div>;
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
        Área do Professor
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Docente: <strong>{user.nome}</strong> | CPF: <strong>{user.cpf}</strong>
      </p>

      {mensagem && (
        <div style={{
          background: mensagem.includes("sucesso") ? "#dcfce7" : "#fee2e2",
          color: mensagem.includes("sucesso") ? "#166534" : "#991b1b",
          padding: "0.75rem 1rem",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem"
        }}>
          {mensagem}
        </div>
      )}

      {/* SELEÇÃO DE TURMAS */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {turmas.map(t => (
          <button
            key={t.id_turma}
            onClick={() => selecionarTurma(t)}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              background: turmaSelecionada?.id_turma === t.id_turma ? "#1e40af" : "#ffffff",
              color: turmaSelecionada?.id_turma === t.id_turma ? "#ffffff" : "#374151",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {t.nome} ({t.codigo_periodo})
          </button>
        ))}
      </div>

      {turmaSelecionada && (
        <div style={{ background: "#ffffff", borderRadius: "0.75rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ marginBottom: "1.25rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "1.3rem", color: "#111827", margin: "0 0 0.25rem 0" }}>{turmaSelecionada.nome}</h2>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "0.9rem" }}>
              Curso: <strong>{turmaSelecionada.nome_curso}</strong> | Código da Turma: <strong>{turmaSelecionada.codigo_turma}</strong>
            </p>
          </div>

          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#374151" }}>Lançamento de Notas</h3>
          {alunosTurma.length === 0 ? (
            <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Nenhum aluno matriculado nesta turma ainda.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb", color: "#4b5563" }}>
                    <th style={{ padding: "0.75rem" }}>Aluno</th>
                    <th style={{ padding: "0.75rem" }}>Matrícula</th>
                    <th style={{ padding: "0.75rem", width: "90px" }}>P1</th>
                    <th style={{ padding: "0.75rem", width: "90px" }}>P2</th>
                    <th style={{ padding: "0.75rem", width: "90px" }}>PF</th>
                    <th style={{ padding: "0.75rem" }}>Média Final</th>
                    <th style={{ padding: "0.75rem" }}>Status</th>
                    <th style={{ padding: "0.75rem", textAlign: "center" }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosTurma.map(a => {
                    const currentNotas = notas[a.id_aluno_curso] || {};
                    return (
                      <tr key={a.id_aluno_curso} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "0.75rem", fontWeight: "500" }}>{a.nome_aluno}</td>
                        <td style={{ padding: "0.75rem", color: "#6b7280" }}>{a.matricula}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={currentNotas.p1 ?? ""}
                            onChange={(e) => handleNotaChange(a.id_aluno_curso, "p1", e.target.value)}
                            style={{ width: "70px", padding: "0.35rem", borderRadius: "0.25rem", border: "1px solid #d1d5db" }}
                          />
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={currentNotas.p2 ?? ""}
                            onChange={(e) => handleNotaChange(a.id_aluno_curso, "p2", e.target.value)}
                            style={{ width: "70px", padding: "0.35rem", borderRadius: "0.25rem", border: "1px solid #d1d5db" }}
                          />
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={currentNotas.pf ?? ""}
                            onChange={(e) => handleNotaChange(a.id_aluno_curso, "pf", e.target.value)}
                            style={{ width: "70px", padding: "0.35rem", borderRadius: "0.25rem", border: "1px solid #d1d5db" }}
                          />
                        </td>
                        <td style={{ padding: "0.75rem", fontWeight: "700" }}>{a.media_final ?? "-"}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <span style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            background: a.status === "concluido" ? "#dcfce7" : "#dbeafe",
                            color: a.status === "concluido" ? "#15803d" : "#1d4ed8"
                          }}>
                            {a.status}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "center" }}>
                          <button
                            onClick={() => salvarNotas(a.id_aluno_curso)}
                            style={{
                              padding: "0.35rem 0.75rem",
                              background: "#1e40af",
                              color: "#fff",
                              border: "none",
                              borderRadius: "0.375rem",
                              fontSize: "0.85rem",
                              cursor: "pointer"
                            }}
                          >
                            Salvar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
