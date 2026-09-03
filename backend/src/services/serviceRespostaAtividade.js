// src/services/serviceRespostaAtividade.js
const DB = require('../config/database');

const service = {
  getByAtividade: async (id_atividade) => {
    const [rows] = await DB.execute(`
      SELECT ra.*, u.nome AS nome_aluno, u.matricula
      FROM resposta_atividade ra
      JOIN usuario u ON u.id_usuario = ra.id_aluno
      WHERE ra.id_atividade = ?
      ORDER BY ra.data_envio DESC;
    `, [id_atividade]);
    return rows;
  },
  createResposta: async ({ id_atividade, id_aluno, conteudo_resposta, caminho_arquivo }) => {
    const [res] = await DB.execute(
      'INSERT INTO resposta_atividade (id_atividade, id_aluno, conteudo_resposta, caminho_arquivo) VALUES (?, ?, ?, ?);',
      [id_atividade, id_aluno, conteudo_resposta || null, caminho_arquivo || null]
    );
    return { id_resposta: res.insertId, id_atividade, id_aluno };
  }
};

module.exports = service;
