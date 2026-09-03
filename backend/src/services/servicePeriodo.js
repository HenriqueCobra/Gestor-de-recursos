// src/services/servicePeriodo.js
const DB = require('../config/database');

const service = {
  getPeriodos: async () => {
    const [rows] = await DB.execute('SELECT * FROM periodo ORDER BY id_periodo DESC;');
    return rows;
  },
  createPeriodo: async ({ codigo, nome, data_inicio, data_fim, ativo = 1 }) => {
    const [res] = await DB.execute(
      'INSERT INTO periodo (codigo, nome, data_inicio, data_fim, ativo) VALUES (?, ?, ?, ?, ?);',
      [codigo, nome, data_inicio, data_fim, ativo ? 1 : 0]
    );
    return { id_periodo: res.insertId, codigo, nome, data_inicio, data_fim, ativo };
  },
  updatePeriodo: async (id, { ativo }) => {
    const [res] = await DB.execute(
      'UPDATE periodo SET ativo = ? WHERE id_periodo = ?;',
      [ativo ? 1 : 0, id]
    );
    return res;
  }
};

module.exports = service;
