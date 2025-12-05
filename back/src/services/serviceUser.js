// src/services/serviceUser.js
const DB = require('../config/database');

const service = {
    Getusers: async () => {
        const [users] = await DB.execute(
            `
            SELECT * FROM usuario;
            `
        );
        return users;
    },

    createUser: async (user) => {
        const { matricula, nome, cpf, senha, tipo, data_entrada } = user;

        const [result] = await DB.execute(
            `
            INSERT INTO usuario (matricula, nome, cpf, senha, tipo, data_entrada)
            VALUES (?, ?, ?, ?, ?, ?);
            `,
            [matricula, nome, cpf, senha, tipo, data_entrada]
        );

        return {
            id_usuario: result.insertId,
            matricula,
            nome,
            cpf,
            tipo,
            data_entrada,
        };
    },
         // verifica o tipo do usuario e se a conta existe 
    Getuser: async (cpf, senha) => {
        const [rows] = await DB.execute(
            `
            SELECT id_usuario, nome, cpf, tipo
            FROM usuario
            WHERE cpf = ? AND senha = ?
            LIMIT 1;
            `,
            [cpf, senha]
        );
        return rows[0] || null;
    },

        // Atualizar só o tipo (bitmask) do usuário
    updateUserTipo: async (id_usuario, tipo) => {
        const [result] = await DB.execute(
            `
            UPDATE usuario
            SET tipo = ?
            WHERE id_usuario = ?;
            `,
            [tipo, id_usuario]
        );
        return result;
    },

    // Excluir usuário
    deleteUser: async (id_usuario) => {
        const [result] = await DB.execute(
            `
            DELETE FROM usuario
            WHERE id_usuario = ?;
            `,
            [id_usuario]
        );
        return result;
    },

    updateUserDados: async (id_usuario, { nome, senha }) => {
        // Atualiza nome sempre; senha só se vier preenchida
        const [result] = await DB.execute(
            `
            UPDATE usuario
            SET 
                nome  = ?,
                senha = IFNULL(?, senha)
            WHERE id_usuario = ?;
            `,
            [nome, senha || null, id_usuario]
        );
        return result;
    },

};

module.exports = service;
