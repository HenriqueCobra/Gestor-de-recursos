// src/routes/routeAlunoCurso.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerAlunoCurso');

router.get('/aluno/:id_aluno', controller.getByAluno);
router.get('/turma/:id_turma', controller.getByTurma);
router.put('/:id/notas', controller.updateNotas);

module.exports = router;
