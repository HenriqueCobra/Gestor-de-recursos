// src/services/serviceInscricao.js
const DB = require('../config/database');

const service = {
  createInscricao: async ({ id_aluno, id_turma }) => {
    const [res] = await DB.execute(
      'INSERT INTO inscricao_turma (id_aluno, id_turma, tentativas_anteriores) VALUES (?, ?, 0);',
      [id_aluno, id_turma]
    );
    return { id_inscricao: res.insertId, id_aluno, id_turma, status: 'pendente' };
  },
  getByAluno: async (id_aluno) => {
    const [rows] = await DB.execute(`
      SELECT it.*, t.nome AS nome_turma, t.codigo_turma, c.nome AS nome_curso, p.codigo AS codigo_periodo, t.status_inscricoes
      FROM inscricao_turma it
      JOIN turma t ON t.id_turma = it.id_turma
      JOIN curso c ON c.id_curso = t.id_curso
      JOIN periodo p ON p.id_periodo = t.id_periodo
      WHERE it.id_aluno = ?
      ORDER BY it.data_inscricao DESC;
    `, [id_aluno]);
    return rows;
  },
  getByTurma: async (id_turma) => {
    const [rows] = await DB.execute(`
      SELECT it.*, u.nome AS nome_aluno, u.matricula, u.cpf
      FROM inscricao_turma it
      JOIN usuario u ON u.id_usuario = it.id_aluno
      WHERE it.id_turma = ?
      ORDER BY it.data_inscricao ASC;
    `, [id_turma]);
    return rows;
  }
};

module.exports = service;
