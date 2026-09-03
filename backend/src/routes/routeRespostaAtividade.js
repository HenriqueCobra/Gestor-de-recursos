// src/routes/routeRespostaAtividade.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerRespostaAtividade');

router.get('/atividade/:id_atividade', controller.getByAtividade);
router.post('/', controller.createResposta);

module.exports = router;
