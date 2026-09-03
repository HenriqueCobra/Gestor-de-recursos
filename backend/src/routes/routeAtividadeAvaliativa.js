// src/routes/routeAtividadeAvaliativa.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerAtividadeAvaliativa');

router.get('/turma/:id_turma', controller.getByTurma);
router.post('/', controller.createAtividade);

module.exports = router;
