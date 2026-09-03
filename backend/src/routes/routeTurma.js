// src/routes/routeTurma.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerTurma');

router.get('/', controller.getTurmas);
router.post('/', controller.createTurma);
router.put('/:id/status', controller.updateStatusInscricoes);

module.exports = router;
