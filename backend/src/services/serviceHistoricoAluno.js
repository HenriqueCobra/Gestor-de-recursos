// src/services/serviceHistoricoAluno.js
const DB = require('../config/database');

const service = {
  getByAluno: async (id_aluno) => {
    const [rows] = await DB.execute(
      'SELECT * FROM historico_aluno WHERE id_aluno = ? ORDER BY data_status DESC;',
      [id_aluno]
    );
    return rows;
  }
};

module.exports = service;
