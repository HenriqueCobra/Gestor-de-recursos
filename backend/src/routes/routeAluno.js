// src/routes/routeAluno.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerAluno');

router.get('/', controller.getAlunos);

module.exports = router;
