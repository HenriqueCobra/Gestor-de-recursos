// src/controller/controllerCurso.js
const service = require('../services/serviceCurso');

const controller = {
  getCursos: async (req, res) => {
    try {
      const cursos = await service.getCursos();
      res.json(cursos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
  },
  createCurso: async (req, res) => {
    try {
      const { nome, descricao, carga_horaria, ativo } = req.body;
      if (!nome || !carga_horaria) {
        return res.status(400).json({ error: 'Nome e carga horária são obrigatórios' });
      }
      const novo = await service.createCurso({ nome, descricao, carga_horaria, ativo });
      res.status(201).json(novo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar curso' });
    }
  },
  updateCurso: async (req, res) => {
    try {
      const { id } = req.params;
      await service.updateCurso(id, req.body);
      res.json({ message: 'Curso atualizado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar curso' });
    }
  },
  deleteCurso: async (req, res) => {
    try {
      const { id } = req.params;
      await service.deleteCurso(id);
      res.json({ message: 'Curso removido com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao remover curso' });
    }
  }
};

module.exports = controller;
