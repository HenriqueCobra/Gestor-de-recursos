// src/controller/controllerHistoricoAluno.js
const service = require('../services/serviceHistoricoAluno');

const controller = {
  getByAluno: async (req, res) => {
    try {
      const { id_aluno } = req.params;
      const rows = await service.getByAluno(id_aluno);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar histórico do aluno' });
    }
  }
};

module.exports = controller;
