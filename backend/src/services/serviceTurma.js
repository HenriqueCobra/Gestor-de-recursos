// src/services/serviceTurma.js
const DB = require('../config/database');

const service = {
  getTurmas: async () => {
    const [rows] = await DB.execute(`
      SELECT t.*, c.nome AS nome_curso, p.codigo AS codigo_periodo, p.nome AS nome_periodo, u.nome AS nome_professor
      FROM turma t
      JOIN curso c ON c.id_curso = t.id_curso
      JOIN periodo p ON p.id_periodo = t.id_periodo
      JOIN usuario u ON u.id_usuario = t.id_professor
      ORDER BY t.id_turma DESC;
    `);
    return rows;
  },
  getTurmasByProfessor: async (id_professor) => {
    const [rows] = await DB.execute(`
      SELECT t.*, c.nome AS nome_curso, p.codigo AS codigo_periodo
      FROM turma t
      JOIN curso c ON c.id_curso = t.id_curso
      JOIN periodo p ON p.id_periodo = t.id_periodo
      WHERE t.id_professor = ?
      ORDER BY t.id_turma DESC;
    `, [id_professor]);
    return rows;
  },
  createTurma: async ({ id_periodo, id_curso, id_professor, nome, codigo_turma, vagas_regulares = 30, vagas_extras = 10, status_inscricoes = 'aberta' }) => {
    const [res] = await DB.execute(
      'INSERT INTO turma (id_periodo, id_curso, id_professor, nome, codigo_turma, vagas_regulares, vagas_extras, status_inscricoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
      [id_periodo, id_curso, id_professor, nome, codigo_turma, vagas_regulares, vagas_extras, status_inscricoes]
    );
    return { id_turma: res.insertId, id_periodo, id_curso, id_professor, nome, codigo_turma, status_inscricoes };
  },
  updateStatusInscricoes: async (id, status_inscricoes) => {
    const [res] = await DB.execute(
      'UPDATE turma SET status_inscricoes = ? WHERE id_turma = ?;',
      [status_inscricoes, id]
    );
    return res;
  }
};

module.exports = service;
