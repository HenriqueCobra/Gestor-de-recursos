// src/services/serviceAtividadeAvaliativa.js
const DB = require('../config/database');

const service = {
  getByTurma: async (id_turma) => {
    const [rows] = await DB.execute('SELECT * FROM atividade_avaliativa WHERE id_turma = ? ORDER BY data_publicacao DESC;', [id_turma]);
    return rows;
  },
  createAtividade: async ({ id_turma, titulo, descricao, tipo = 'exercicio', data_limite, valor = 10, permite_atraso = 0 }) => {
    const [res] = await DB.execute(
      'INSERT INTO atividade_avaliativa (id_turma, titulo, descricao, tipo, data_limite, valor, permite_atraso) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [id_turma, titulo, descricao || null, tipo, data_limite, valor, permite_atraso ? 1 : 0]
    );
    return { id_atividade: res.insertId, id_turma, titulo, tipo, data_limite, valor };
  }
};

module.exports = service;
