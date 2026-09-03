// src/routes/routeHistoricoAluno.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerHistoricoAluno');

router.get('/:id_aluno', controller.getByAluno);

module.exports = router;
