// src/routes/routeCurso.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerCurso');

router.get('/', controller.getCursos);
router.post('/', controller.createCurso);
router.put('/:id', controller.updateCurso);
router.delete('/:id', controller.deleteCurso);

module.exports = router;
