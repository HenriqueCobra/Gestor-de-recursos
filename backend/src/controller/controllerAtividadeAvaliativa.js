// src/controller/controllerAtividadeAvaliativa.js
const service = require('../services/serviceAtividadeAvaliativa');

const controller = {
  getByTurma: async (req, res) => {
    try {
      const { id_turma } = req.params;
      const rows = await service.getByTurma(id_turma);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar atividades' });
    }
  },
  createAtividade: async (req, res) => {
    try {
      const novo = await service.createAtividade(req.body);
      res.status(201).json(novo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar atividade' });
    }
  }
};

module.exports = controller;
