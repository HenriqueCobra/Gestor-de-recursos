// src/routes/routeInscricao.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerInscricao');

router.post('/', controller.createInscricao);
router.get('/aluno/:id_aluno', controller.getByAluno);
router.get('/turma/:id_turma', controller.getByTurma);

module.exports = router;
