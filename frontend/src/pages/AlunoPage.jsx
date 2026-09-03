import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AlunoPage() {
  const { user, API_URL } = useAuth();
  const [turmasMatriculadas, setTurmasMatriculadas] = useState([]);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [resMatriculas, resTurmas, resHist] = await Promise.all([
        fetch(`${API_URL}/aluno_curso/aluno/${user.id_usuario}`),
        fetch(`${API_URL}/turma`),
        fetch(`${API_URL}/historico_aluno/${user.id_usuario}`)
      ]);

      const [matriculasData, turmasData, histData] = await Promise.all([
        resMatriculas.json(),
        resTurmas.json(),
        resHist.json()
      ]);

      setTurmasMatriculadas(Array.isArray(matriculasData) ? matriculasData : []);
      setTurmasDisponiveis(Array.isArray(turmasData) ? turmasData : []);
      setHistorico(Array.isArray(histData) ? histData : []);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao carregar dados do aluno");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (user?.id_usuario) {
      carregarDados();
    }
  }, [user]);

  const matricular = async (id_turma) => {
    try {
      setMensagem("");
      const res = await fetch(`${API_URL}/inscricoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_aluno: user.id_usuario,
          id_turma: id_turma
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao solicitar inscrição");

      setMensagem("Inscrição realizada com sucesso! Aguarde o fechamento das inscrições para aprovação das vagas.");
      carregarDados();
    } catch (err) {
      setMensagem(err.message);
    }
  };

  if (carregando) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Carregando dados do aluno...</div>;
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
        Área do Aluno
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Matrícula: <strong>{user.matricula || "N/D"}</strong> | Nome: <strong>{user.nome}</strong>
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

      {/* MINHAS DISCIPLINAS E NOTAS */}
      <section style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
          Minhas Disciplinas em Andamento
        </h2>
        {turmasMatriculadas.length === 0 ? (
          <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Você não está cursando nenhuma disciplina no momento.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", color: "#4b5563" }}>
                  <th style={{ padding: "0.75rem" }}>Turma / Curso</th>
                  <th style={{ padding: "0.75rem" }}>Período</th>
                  <th style={{ padding: "0.75rem" }}>Professor</th>
                  <th style={{ padding: "0.75rem" }}>P1</th>
                  <th style={{ padding: "0.75rem" }}>P2</th>
                  <th style={{ padding: "0.75rem" }}>PF</th>
                  <th style={{ padding: "0.75rem" }}>Média Final</th>
                  <th style={{ padding: "0.75rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {turmasMatriculadas.map((item) => (
                  <tr key={item.id_aluno_curso} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.75rem", fontWeight: "500" }}>{item.nome_turma} ({item.nome_curso})</td>
                    <td style={{ padding: "0.75rem" }}>{item.codigo_periodo}</td>
                    <td style={{ padding: "0.75rem" }}>{item.nome_professor}</td>
                    <td style={{ padding: "0.75rem" }}>{item.p1 ?? "-"}</td>
                    <td style={{ padding: "0.75rem" }}>{item.p2 ?? "-"}</td>
                    <td style={{ padding: "0.75rem" }}>{item.pf ?? "-"}</td>
                    <td style={{ padding: "0.75rem", fontWeight: "700" }}>{item.media_final ?? "-"}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        background: item.status === "concluido" ? "#dcfce7" : "#dbeafe",
                        color: item.status === "concluido" ? "#15803d" : "#1d4ed8"
                      }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* TURMAS DISPONÍVEIS PARA INSCRIÇÃO */}
      <section style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
          Turmas com Inscrições Abertas
        </h2>
        {turmasDisponiveis.filter(t => t.status_inscricoes === 'aberta').length === 0 ? (
          <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Nenhuma turma disponível com inscrições abertas no momento.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {turmasDisponiveis.filter(t => t.status_inscricoes === 'aberta').map(t => (
              <div key={t.id_turma} style={{ border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "1rem", background: "#f9fafb" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "#111827" }}>{t.nome}</h3>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#4b5563" }}><strong>Curso:</strong> {t.nome_curso}</p>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#4b5563" }}><strong>Período:</strong> {t.codigo_periodo}</p>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem", color: "#4b5563" }}><strong>Professor:</strong> {t.nome_professor}</p>
                <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#4b5563" }}><strong>Vagas:</strong> {t.vagas_regulares} regulares + {t.vagas_extras} extras</p>
                <button
                  onClick={() => matricular(t.id_turma)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.375rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Solicitar Matrícula
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HISTÓRICO ACADÊMICO */}
      <section style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
          Histórico Acadêmico
        </h2>
        {historico.length === 0 ? (
          <p style={{ color: "#9ca3af", fontStyle: "italic" }}>Nenhum registro finalizado no histórico ainda.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", color: "#4b5563" }}>
                  <th style={{ padding: "0.75rem" }}>Curso</th>
                  <th style={{ padding: "0.75rem" }}>Turma</th>
                  <th style={{ padding: "0.75rem" }}>Período</th>
                  <th style={{ padding: "0.75rem" }}>Média Final</th>
                  <th style={{ padding: "0.75rem" }}>Resultado</th>
                  <th style={{ padding: "0.75rem" }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((h) => (
                  <tr key={h.id_historico} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.75rem", fontWeight: "500" }}>{h.nome_curso}</td>
                    <td style={{ padding: "0.75rem" }}>{h.nome_turma}</td>
                    <td style={{ padding: "0.75rem" }}>{h.codigo_periodo}</td>
                    <td style={{ padding: "0.75rem", fontWeight: "700" }}>{h.media_final}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        background: h.status === "Aprovado" ? "#dcfce7" : "#fee2e2",
                        color: h.status === "Aprovado" ? "#15803d" : "#991b1b"
                      }}>
                        {h.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>{new Date(h.data_status).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
