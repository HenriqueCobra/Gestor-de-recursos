// src/routes/routeMaterialAula.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerMaterialAula');

router.get('/turma/:id_turma', controller.getByTurma);
router.post('/', controller.createMaterial);

module.exports = router;
