// src/controller/controllerRespostaAtividade.js
const service = require('../services/serviceRespostaAtividade');

const controller = {
  getByAtividade: async (req, res) => {
    try {
      const { id_atividade } = req.params;
      const rows = await service.getByAtividade(id_atividade);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar respostas da atividade' });
    }
  },
  createResposta: async (req, res) => {
    try {
      const novo = await service.createResposta(req.body);
      res.status(201).json(novo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao submeter resposta' });
    }
  }
};

module.exports = controller;
