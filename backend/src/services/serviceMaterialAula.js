// src/services/serviceMaterialAula.js
const DB = require('../config/database');

const service = {
  getByTurma: async (id_turma) => {
    const [rows] = await DB.execute('SELECT * FROM material_aula WHERE id_turma = ? ORDER BY data_publicacao DESC;', [id_turma]);
    return rows;
  },
  createMaterial: async ({ id_turma, titulo, descricao, tipo = 'outro', caminho_arquivo }) => {
    const [res] = await DB.execute(
      'INSERT INTO material_aula (id_turma, titulo, descricao, tipo, caminho_arquivo) VALUES (?, ?, ?, ?, ?);',
      [id_turma, titulo, descricao || null, tipo, caminho_arquivo || null]
    );
    return { id_material: res.insertId, id_turma, titulo, tipo, caminho_arquivo };
  }
};

module.exports = service;
