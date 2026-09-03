// src/controller/controllerAluno.js
const service = require('../services/serviceAluno');

const controller = {
  getAlunos: async (req, res) => {
    try {
      const rows = await service.getAlunos();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar alunos' });
    }
  }
};

module.exports = controller;
