// src/services/serviceCurso.js
const DB = require('../config/database');

const service = {
  getCursos: async () => {
    const [rows] = await DB.execute('SELECT * FROM curso ORDER BY id_curso DESC;');
    return rows;
  },
  createCurso: async ({ nome, descricao, carga_horaria, ativo = 1 }) => {
    const [res] = await DB.execute(
      'INSERT INTO curso (nome, descricao, carga_horaria, ativo) VALUES (?, ?, ?, ?);',
      [nome, descricao || null, carga_horaria, ativo ? 1 : 0]
    );
    return { id_curso: res.insertId, nome, descricao, carga_horaria, ativo };
  },
  updateCurso: async (id, { nome, descricao, carga_horaria, ativo }) => {
    const [res] = await DB.execute(
      'UPDATE curso SET nome = COALESCE(?, nome), descricao = COALESCE(?, descricao), carga_horaria = COALESCE(?, carga_horaria), ativo = COALESCE(?, ativo) WHERE id_curso = ?;',
      [nome || null, descricao || null, carga_horaria || null, ativo !== undefined ? (ativo ? 1 : 0) : null, id]
    );
    return res;
  },
  deleteCurso: async (id) => {
    const [res] = await DB.execute('DELETE FROM curso WHERE id_curso = ?;', [id]);
    return res;
  }
};

module.exports = service;
