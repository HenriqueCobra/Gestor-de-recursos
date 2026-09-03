// src/services/serviceAlunoCurso.js
const DB = require('../config/database');

const service = {
  getByAluno: async (id_aluno) => {
    const [rows] = await DB.execute(`
      SELECT ac.*, c.nome AS nome_curso, t.nome AS nome_turma, t.codigo_turma, p.codigo AS codigo_periodo, u.nome AS nome_professor
      FROM aluno_curso ac
      JOIN curso c ON c.id_curso = ac.id_curso
      JOIN turma t ON t.id_turma = ac.id_turma
      JOIN periodo p ON p.id_periodo = t.id_periodo
      JOIN usuario u ON u.id_usuario = t.id_professor
      WHERE ac.id_aluno = ?
      ORDER BY ac.id_aluno_curso DESC;
    `, [id_aluno]);
    return rows;
  },
  getByTurma: async (id_turma) => {
    const [rows] = await DB.execute(`
      SELECT ac.*, u.nome AS nome_aluno, u.matricula, u.cpf
      FROM aluno_curso ac
      JOIN usuario u ON u.id_usuario = ac.id_aluno
      WHERE ac.id_turma = ?
      ORDER BY u.nome ASC;
    `, [id_turma]);
    return rows;
  },
  updateNotas: async (id_aluno_curso, { p1, p2, pf }) => {
    const [res] = await DB.execute(`
      UPDATE aluno_curso
      SET p1 = COALESCE(?, p1),
          p2 = COALESCE(?, p2),
          pf = COALESCE(?, pf)
      WHERE id_aluno_curso = ?;
    `, [p1 !== undefined ? p1 : null, p2 !== undefined ? p2 : null, pf !== undefined ? pf : null, id_aluno_curso]);
    return res;
  }
};

module.exports = service;
