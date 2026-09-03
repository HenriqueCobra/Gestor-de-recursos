import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { API_URL } = useAuth();
  const [aba, setAba] = useState("usuarios"); // usuarios, cursos, periodos, turmas
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  // Formulários
  const [novoUsuario, setNovoUsuario] = useState({ matricula: "", nome: "", cpf: "", senha: "", tipo: 1, data_entrada: new Date().toISOString().split("T")[0] });
  const [novoCurso, setNovoCurso] = useState({ nome: "", descricao: "", carga_horaria: 60 });
  const [novoPeriodo, setNovoPeriodo] = useState({ codigo: "", nome: "", data_inicio: "", data_fim: "" });
  const [novaTurma, setNovaTurma] = useState({ id_periodo: "", id_curso: "", id_professor: "", nome: "", codigo_turma: "", vagas_regulares: 30, vagas_extras: 10 });

  const carregarTudo = async () => {
    try {
      const [uRes, cRes, pRes, tRes] = await Promise.all([
        fetch(`${API_URL}/user`),
        fetch(`${API_URL}/curso`),
        fetch(`${API_URL}/periodo`),
        fetch(`${API_URL}/turma`)
      ]);
      const [uData, cData, pData, tData] = await Promise.all([
        uRes.json(), cRes.json(), pRes.json(), tRes.json()
      ]);
      setUsuarios(Array.isArray(uData) ? uData : []);
      setCursos(Array.isArray(cData) ? cData : []);
      setPeriodos(Array.isArray(pData) ? pData : []);
      setTurmas(Array.isArray(tData) ? tData : []);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao carregar dados do administrador");
    }
  };

  useEffect(() => {
    carregarTudo();
  }, []);

  const criarUsuario = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...novoUsuario, tipo: Number(novoUsuario.tipo) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar usuário");
      setMensagem("Usuário cadastrado com sucesso!");
      setNovoUsuario({ matricula: "", nome: "", cpf: "", senha: "", tipo: 1, data_entrada: new Date().toISOString().split("T")[0] });
      carregarTudo();
    } catch (err) {
      setMensagem(err.message);
    }
  };

  const atualizarTipoUsuario = async (id, tipo) => {
    try {
      const res = await fetch(`${API_URL}/user/${id}/tipo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: Number(tipo) })
      });
      if (!res.ok) throw new Error("Erro ao atualizar tipo");
      setMensagem("Tipo de usuário atualizado com sucesso!");
      carregarTudo();
    } catch (err) {
      setMensagem(err.message);
    }
  };

  const criarCurso = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/curso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...novoCurso, carga_horaria: Number(novoCurso.carga_horaria) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar curso");
      setMensagem("Curso criado com sucesso!");
      setNovoCurso({ nome: "", descricao: "", carga_horaria: 60 });
      carregarTudo();
    } catch (err) {
      setMensagem(err.message);
    }
  };

  const criarPeriodo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/periodo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPeriodo)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar período");
      setMensagem("Período criado com sucesso!");
      setNovoPeriodo({ codigo: "", nome: "", data_inicio: "", data_fim: "" });
      carregarTudo();
    } catch (err) {
      setMensagem(err.message);
    }
  };

  const criarTurma = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/turma`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...novaTurma,
          id_periodo: Number(novaTurma.id_periodo),
          id_curso: Number(novaTurma.id_curso),
          id_professor: Number(novaTurma.id_professor),
          vagas_regulares: Number(novaTurma.vagas_regulares),
          vagas_extras: Number(novaTurma.vagas_extras)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar turma");
      setMensagem("Turma criada com sucesso!");
      setNovaTurma({ id_periodo: "", id_curso: "", id_professor: "", nome: "", codigo_turma: "", vagas_regulares: 30, vagas_extras: 10 });
      carregarTudo();
    } catch (err) {
      setMensagem(err.message);
    }
  };

  const alternarInscricoes = async (id_turma, statusAtual) => {
    const novoStatus = statusAtual === "aberta" ? "fechada" : "aberta";
    try {
      const res = await fetch(`${API_URL}/turma/${id_turma}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_inscricoes: novoStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao alterar status");
      setMensagem(`Inscrições da turma alteradas para: ${novoStatus} (processamento automático via trigger executado!)`);
      carregarTudo();
    } catch (err) {
      setMensagem(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
        Painel de Administração
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Gerenciamento central de usuários, cursos, períodos letivos e turmas.
      </p>

      {mensagem && (
        <div style={{
          background: mensagem.includes("sucesso") || mensagem.includes("alteradas") ? "#dcfce7" : "#fee2e2",
          color: mensagem.includes("sucesso") || mensagem.includes("alteradas") ? "#166534" : "#991b1b",
          padding: "0.75rem 1rem",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem"
        }}>
          {mensagem}
        </div>
      )}

      {/* ABAS */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "2px solid #e5e7eb", paddingBottom: "0.5rem" }}>
        {[
          { id: "usuarios", label: "👥 Usuários" },
          { id: "cursos", label: "📚 Cursos" },
          { id: "periodos", label: "📅 Períodos" },
          { id: "turmas", label: "🏫 Turmas" }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => { setAba(item.id); setMensagem(""); }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "none",
              background: aba === item.id ? "#1e40af" : "transparent",
              color: aba === item.id ? "#ffffff" : "#4b5563",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ABA USUÁRIOS */}
      {aba === "usuarios" && (
        <div>
          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0" }}>Cadastrar Novo Usuário</h3>
            <form onSubmit={criarUsuario} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <input placeholder="Matrícula" value={novoUsuario.matricula} onChange={e => setNovoUsuario({ ...novoUsuario, matricula: e.target.value })} style={{ padding: "0.5rem" }} />
              <input placeholder="Nome Completo" required value={novoUsuario.nome} onChange={e => setNovoUsuario({ ...novoUsuario, nome: e.target.value })} style={{ padding: "0.5rem" }} />
              <input placeholder="CPF (11 dígitos)" required maxLength={11} value={novoUsuario.cpf} onChange={e => setNovoUsuario({ ...novoUsuario, cpf: e.target.value.replace(/\D/g, "") })} style={{ padding: "0.5rem" }} />
              <input type="password" placeholder="Senha" required value={novoUsuario.senha} onChange={e => setNovoUsuario({ ...novoUsuario, senha: e.target.value })} style={{ padding: "0.5rem" }} />
              <select value={novoUsuario.tipo} onChange={e => setNovoUsuario({ ...novoUsuario, tipo: e.target.value })} style={{ padding: "0.5rem" }}>
                <option value={1}>Aluno (1)</option>
                <option value={2}>Professor (2)</option>
                <option value={4}>Administrador (4)</option>
                <option value={3}>Aluno + Professor (3)</option>
                <option value={7}>Acesso Total (7)</option>
              </select>
              <button type="submit" style={{ background: "#1e40af", color: "#fff", border: "none", borderRadius: "0.375rem", padding: "0.5rem", fontWeight: "600", cursor: "pointer" }}>
                + Salvar Usuário
              </button>
            </form>
          </div>

          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0" }}>Usuários Registrados</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "0.5rem" }}>ID</th>
                  <th style={{ padding: "0.5rem" }}>Nome</th>
                  <th style={{ padding: "0.5rem" }}>CPF</th>
                  <th style={{ padding: "0.5rem" }}>Matrícula</th>
                  <th style={{ padding: "0.5rem" }}>Tipo (Bitmask)</th>
                  <th style={{ padding: "0.5rem" }}>Alterar Papel</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id_usuario} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.5rem" }}>{u.id_usuario}</td>
                    <td style={{ padding: "0.5rem", fontWeight: "500" }}>{u.nome}</td>
                    <td style={{ padding: "0.5rem" }}>{u.cpf}</td>
                    <td style={{ padding: "0.5rem" }}>{u.matricula || "-"}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {((u.tipo & 1) ? " Aluno " : "")}
                      {((u.tipo & 2) ? " Prof " : "")}
                      {((u.tipo & 4) ? " Admin " : "")}
                      ({u.tipo})
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <select defaultValue={u.tipo} onChange={e => atualizarTipoUsuario(u.id_usuario, e.target.value)} style={{ padding: "0.3rem" }}>
                        <option value={1}>Aluno (1)</option>
                        <option value={2}>Professor (2)</option>
                        <option value={4}>Administrador (4)</option>
                        <option value={7}>Total (7)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA CURSOS */}
      {aba === "cursos" && (
        <div>
          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0" }}>Cadastrar Novo Curso</h3>
            <form onSubmit={criarCurso} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <input placeholder="Nome do Curso" required value={novoCurso.nome} onChange={e => setNovoCurso({ ...novoCurso, nome: e.target.value })} style={{ padding: "0.5rem" }} />
              <input placeholder="Descrição" value={novoCurso.descricao} onChange={e => setNovoCurso({ ...novoCurso, descricao: e.target.value })} style={{ padding: "0.5rem" }} />
              <input type="number" placeholder="Carga Horária (h)" required value={novoCurso.carga_horaria} onChange={e => setNovoCurso({ ...novoCurso, carga_horaria: e.target.value })} style={{ padding: "0.5rem" }} />
              <button type="submit" style={{ background: "#1e40af", color: "#fff", border: "none", borderRadius: "0.375rem", padding: "0.5rem", fontWeight: "600", cursor: "pointer" }}>
                + Salvar Curso
              </button>
            </form>
          </div>

          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0" }}>Cursos Cadastrados</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "0.5rem" }}>ID</th>
                  <th style={{ padding: "0.5rem" }}>Nome</th>
                  <th style={{ padding: "0.5rem" }}>Descrição</th>
                  <th style={{ padding: "0.5rem" }}>Carga Horária</th>
                  <th style={{ padding: "0.5rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map(c => (
                  <tr key={c.id_curso} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.5rem" }}>{c.id_curso}</td>
                    <td style={{ padding: "0.5rem", fontWeight: "500" }}>{c.nome}</td>
                    <td style={{ padding: "0.5rem" }}>{c.descricao || "-"}</td>
                    <td style={{ padding: "0.5rem" }}>{c.carga_horaria}h</td>
                    <td style={{ padding: "0.5rem" }}>{c.ativo ? "✅ Ativo" : "Inativo"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA PERIODOS */}
      {aba === "periodos" && (
        <div>
          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0" }}>Cadastrar Novo Período Letivo</h3>
            <form onSubmit={criarPeriodo} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <input placeholder="Código (ex: 2026.2)" required value={novoPeriodo.codigo} onChange={e => setNovoPeriodo({ ...novoPeriodo, codigo: e.target.value })} style={{ padding: "0.5rem" }} />
              <input placeholder="Nome (ex: Segundo Semestre 2026)" required value={novoPeriodo.nome} onChange={e => setNovoPeriodo({ ...novoPeriodo, nome: e.target.value })} style={{ padding: "0.5rem" }} />
              <input type="date" required value={novoPeriodo.data_inicio} onChange={e => setNovoPeriodo({ ...novoPeriodo, data_inicio: e.target.value })} style={{ padding: "0.5rem" }} />
              <input type="date" required value={novoPeriodo.data_fim} onChange={e => setNovoPeriodo({ ...novoPeriodo, data_fim: e.target.value })} style={{ padding: "0.5rem" }} />
              <button type="submit" style={{ background: "#1e40af", color: "#fff", border: "none", borderRadius: "0.375rem", padding: "0.5rem", fontWeight: "600", cursor: "pointer" }}>
                + Salvar Período
              </button>
            </form>
          </div>

          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0" }}>Períodos Letivos</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "0.5rem" }}>Código</th>
                  <th style={{ padding: "0.5rem" }}>Nome</th>
                  <th style={{ padding: "0.5rem" }}>Início</th>
                  <th style={{ padding: "0.5rem" }}>Fim</th>
                  <th style={{ padding: "0.5rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {periodos.map(p => (
                  <tr key={p.id_periodo} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.5rem", fontWeight: "600" }}>{p.codigo}</td>
                    <td style={{ padding: "0.5rem" }}>{p.nome}</td>
                    <td style={{ padding: "0.5rem" }}>{new Date(p.data_inicio).toLocaleDateString("pt-BR")}</td>
                    <td style={{ padding: "0.5rem" }}>{new Date(p.data_fim).toLocaleDateString("pt-BR")}</td>
                    <td style={{ padding: "0.5rem" }}>{p.ativo ? "✅ Ativo" : "Encerrado"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA TURMAS */}
      {aba === "turmas" && (
        <div>
          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0" }}>Criar Nova Turma</h3>
            <form onSubmit={criarTurma} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <input placeholder="Nome da Turma" required value={novaTurma.nome} onChange={e => setNovaTurma({ ...novaTurma, nome: e.target.value })} style={{ padding: "0.5rem" }} />
              <input placeholder="Código (ex: ES26-1)" required value={novaTurma.codigo_turma} onChange={e => setNovaTurma({ ...novaTurma, codigo_turma: e.target.value })} style={{ padding: "0.5rem" }} />
              <select required value={novaTurma.id_periodo} onChange={e => setNovaTurma({ ...novaTurma, id_periodo: e.target.value })} style={{ padding: "0.5rem" }}>
                <option value="">Selecione o Período</option>
                {periodos.map(p => <option key={p.id_periodo} value={p.id_periodo}>{p.codigo} - {p.nome}</option>)}
              </select>
              <select required value={novaTurma.id_curso} onChange={e => setNovaTurma({ ...novaTurma, id_curso: e.target.value })} style={{ padding: "0.5rem" }}>
                <option value="">Selecione o Curso</option>
                {cursos.map(c => <option key={c.id_curso} value={c.id_curso}>{c.nome}</option>)}
              </select>
              <select required value={novaTurma.id_professor} onChange={e => setNovaTurma({ ...novaTurma, id_professor: e.target.value })} style={{ padding: "0.5rem" }}>
                <option value="">Selecione o Professor</option>
                {usuarios.filter(u => (u.tipo & 2) !== 0).map(prof => <option key={prof.id_usuario} value={prof.id_usuario}>{prof.nome}</option>)}
              </select>
              <input type="number" placeholder="Vagas Regulares" value={novaTurma.vagas_regulares} onChange={e => setNovaTurma({ ...novaTurma, vagas_regulares: e.target.value })} style={{ padding: "0.5rem" }} />
              <input type="number" placeholder="Vagas Extras" value={novaTurma.vagas_extras} onChange={e => setNovaTurma({ ...novaTurma, vagas_extras: e.target.value })} style={{ padding: "0.5rem" }} />
              <button type="submit" style={{ background: "#1e40af", color: "#fff", border: "none", borderRadius: "0.375rem", padding: "0.5rem", fontWeight: "600", cursor: "pointer" }}>
                + Salvar Turma
              </button>
            </form>
          </div>

          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 1rem 0" }}>Turmas Existentes</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "0.5rem" }}>Código</th>
                  <th style={{ padding: "0.5rem" }}>Nome</th>
                  <th style={{ padding: "0.5rem" }}>Curso</th>
                  <th style={{ padding: "0.5rem" }}>Período</th>
                  <th style={{ padding: "0.5rem" }}>Professor</th>
                  <th style={{ padding: "0.5rem" }}>Inscrições</th>
                  <th style={{ padding: "0.5rem" }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map(t => (
                  <tr key={t.id_turma} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.5rem", fontWeight: "600" }}>{t.codigo_turma}</td>
                    <td style={{ padding: "0.5rem" }}>{t.nome}</td>
                    <td style={{ padding: "0.5rem" }}>{t.nome_curso}</td>
                    <td style={{ padding: "0.5rem" }}>{t.codigo_periodo}</td>
                    <td style={{ padding: "0.5rem" }}>{t.nome_professor}</td>
                    <td style={{ padding: "0.5rem" }}>
                      <span style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        background: t.status_inscricoes === "aberta" ? "#dcfce7" : "#fee2e2",
                        color: t.status_inscricoes === "aberta" ? "#15803d" : "#991b1b"
                      }}>
                        {t.status_inscricoes}
                      </span>
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <button
                        onClick={() => alternarInscricoes(t.id_turma, t.status_inscricoes)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          borderRadius: "0.25rem",
                          border: "1px solid #d1d5db",
                          background: "#f3f4f6",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {t.status_inscricoes === "aberta" ? "🔒 Fechar Inscrições" : "🔓 Reabrir Inscrições"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
