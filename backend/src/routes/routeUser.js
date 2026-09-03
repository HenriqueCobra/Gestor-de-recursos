// src/routes/routeUser.js
const { Router } = require('express');
const router = Router();
const controller = require('../controller/controllerUser');

router.get('/', controller.getUsers);
router.post('/', controller.createUser); 
router.post('/login', controller.login);
router.put('/:id/tipo', controller.updateTipo);
router.delete('/:id', controller.deleteUser);
router.put('/:id', controller.updateDados);
module.exports = router;
