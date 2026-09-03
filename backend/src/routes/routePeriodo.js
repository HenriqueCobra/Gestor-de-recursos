// src/routes/routePeriodo.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerPeriodo');

router.get('/', controller.getPeriodos);
router.post('/', controller.createPeriodo);
router.put('/:id', controller.updatePeriodo);

module.exports = router;
