// src/controller/controllerPeriodo.js
const service = require('../services/servicePeriodo');

const controller = {
  getPeriodos: async (req, res) => {
    try {
      const rows = await service.getPeriodos();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar períodos' });
    }
  },
  createPeriodo: async (req, res) => {
    try {
      const { codigo, nome, data_inicio, data_fim, ativo } = req.body;
      if (!codigo || !nome || !data_inicio || !data_fim) {
        return res.status(400).json({ error: 'Preencha todos os campos do período' });
      }
      const novo = await service.createPeriodo({ codigo, nome, data_inicio, data_fim, ativo });
      res.status(201).json(novo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar período' });
    }
  },
  updatePeriodo: async (req, res) => {
    try {
      const { id } = req.params;
      const { ativo } = req.body;
      await service.updatePeriodo(id, { ativo });
      res.json({ message: 'Período atualizado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar período' });
    }
  }
};

module.exports = controller;
