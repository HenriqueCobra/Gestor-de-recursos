// src/controller/controllerInscricao.js
const service = require('../services/serviceInscricao');

const controller = {
  createInscricao: async (req, res) => {
    try {
      const { id_aluno, id_turma } = req.body;
      if (!id_aluno || !id_turma) {
        return res.status(400).json({ error: 'id_aluno e id_turma são obrigatórios' });
      }
      const nova = await service.createInscricao({ id_aluno, id_turma });
      res.status(201).json(nova);
    } catch (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Aluno já inscrito nesta turma' });
      }
      res.status(500).json({ error: 'Erro ao realizar inscrição' });
    }
  },
  getByAluno: async (req, res) => {
    try {
      const { id_aluno } = req.params;
      const rows = await service.getByAluno(id_aluno);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar inscrições' });
    }
  },
  getByTurma: async (req, res) => {
    try {
      const { id_turma } = req.params;
      const rows = await service.getByTurma(id_turma);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar inscrições da turma' });
    }
  }
};

module.exports = controller;
