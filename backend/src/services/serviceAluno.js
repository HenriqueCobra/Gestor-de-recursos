// src/services/serviceAluno.js
const DB = require('../config/database');

const service = {
  getAlunos: async () => {
    const [rows] = await DB.execute('SELECT id_usuario, matricula, nome, cpf, data_entrada FROM usuario WHERE (tipo & 1) != 0;');
    return rows;
  }
};

module.exports = service;
