// src/services/serviceUser.js
const DB = require('../config/database');
const bcrypt = require('bcryptjs');

const service = {
    Getusers: async () => {
        const [users] = await DB.execute(
            `
            SELECT * FROM usuario;
            SELECT id_usuario, matricula, nome, cpf, tipo, data_entrada
            FROM usuario;
            `
        );
        return users;
    },

    createUser: async (user) => {
        const { matricula, nome, cpf, senha, tipo, data_entrada } = user;
        const hashedPassword = await bcrypt.hash(senha, 10);

        const [result] = await DB.execute(
            `
            INSERT INTO usuario (matricula, nome, cpf, senha, tipo, data_entrada)
            VALUES (?, ?, ?, ?, ?, ?);
            `,
            [matricula, nome, cpf, senha, tipo, data_entrada]
            [matricula || null, nome, cpf, hashedPassword, tipo, data_entrada]
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

    // verifica o tipo do usuario e se a conta existe 
    Getuser: async (cpf, senha) => {
        const [rows] = await DB.execute(
            `
            SELECT id_usuario, nome, cpf, tipo
            SELECT id_usuario, matricula, nome, cpf, senha, tipo
            FROM usuario
            WHERE cpf = ? AND senha = ?
            WHERE cpf = ?
            LIMIT 1;
            `,
            [cpf, senha]
            [cpf]
        );
        return rows[0] || null;

        const user = rows[0];
        if (!user) return null;

        let passwordMatch = false;
        // Verifica se a senha armazenada é um hash bcrypt válido
        try {
            passwordMatch = await bcrypt.compare(senha, user.senha);
        } catch (e) {
            passwordMatch = false;
        }

        // Compatibilidade com senhas antigas em texto puro (como no seed)
        if (!passwordMatch && user.senha === senha) {
            passwordMatch = true;
            // Atualiza de forma transparente para hash seguro
            const upgradedHash = await bcrypt.hash(senha, 10);
            await DB.execute(
                `UPDATE usuario SET senha = ? WHERE id_usuario = ?`,
                [upgradedHash, user.id_usuario]
            );
        }

        if (!passwordMatch) return null;

        return {
            id_usuario: user.id_usuario,
            matricula: user.matricula,
            nome: user.nome,
            cpf: user.cpf,
            tipo: user.tipo,
        };
    },

        // Atualizar só o tipo (bitmask) do usuário
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
        if (senha) {
            const hashed = await bcrypt.hash(senha, 10);
            const [result] = await DB.execute(
                `
                UPDATE usuario
                SET 
                    nome  = COALESCE(?, nome),
                    senha = ?
                WHERE id_usuario = ?;
                `,
                [nome || null, hashed, id_usuario]
            );
            return result;
        } else {
            const [result] = await DB.execute(
                `
                UPDATE usuario
                SET 
                    nome  = COALESCE(?, nome)
                WHERE id_usuario = ?;
                `,
                [nome || null, id_usuario]
            );
            return result;
        }
    },

};

module.exports = service;
