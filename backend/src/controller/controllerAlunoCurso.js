// src/controller/controllerAlunoCurso.js
const service = require('../services/serviceAlunoCurso');

const controller = {
  getByAluno: async (req, res) => {
    try {
      const { id_aluno } = req.params;
      const rows = await service.getByAluno(id_aluno);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar turmas do aluno' });
    }
  },
  getByTurma: async (req, res) => {
    try {
      const { id_turma } = req.params;
      const rows = await service.getByTurma(id_turma);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar alunos da turma' });
    }
  },
  updateNotas: async (req, res) => {
    try {
      const { id } = req.params;
      const { p1, p2, pf } = req.body;
      await service.updateNotas(id, { p1, p2, pf });
      res.json({ message: 'Notas salvas com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao lançar notas' });
    }
  }
};

module.exports = controller;
