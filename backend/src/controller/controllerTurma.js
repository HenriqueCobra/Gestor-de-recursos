// src/controller/controllerTurma.js
const service = require('../services/serviceTurma');

const controller = {
  getTurmas: async (req, res) => {
    try {
      const { professor } = req.query;
      const rows = professor ? await service.getTurmasByProfessor(professor) : await service.getTurmas();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar turmas' });
    }
  },
  createTurma: async (req, res) => {
    try {
      const { id_periodo, id_curso, id_professor, nome, codigo_turma, vagas_regulares, vagas_extras, status_inscricoes } = req.body;
      if (!id_periodo || !id_curso || !id_professor || !nome || !codigo_turma) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }
      const nova = await service.createTurma({ id_periodo, id_curso, id_professor, nome, codigo_turma, vagas_regulares, vagas_extras, status_inscricoes });
      res.status(201).json(nova);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar turma' });
    }
  },
  updateStatusInscricoes: async (req, res) => {
    try {
      const { id } = req.params;
      const { status_inscricoes } = req.body;
      if (!['aberta', 'fechada'].includes(status_inscricoes)) {
        return res.status(400).json({ error: 'Status inválido. Use aberta ou fechada' });
      }
      await service.updateStatusInscricoes(id, status_inscricoes);
      res.json({ message: 'Status de inscrições alterado para ' + status_inscricoes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar status de inscrições' });
    }
  }
};

module.exports = controller;
