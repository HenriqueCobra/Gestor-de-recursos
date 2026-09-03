// src/controller/controllerUser.js
const service = require('../services/serviceUser');

const controller = {
    getUsers: async (req, res) => {
        try {
            const users = await service.Getusers();
            res.status(200).json(users);
        } catch (err) {
            console.error('Erro ao buscar usuários:', err);
            res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    },

    createUser: async (req, res) => {
        try {
            const { matricula, nome, cpf, senha, tipo, data_entrada } = req.body;

            // validação básica
            if (!nome || !cpf || !senha || !tipo || !data_entrada) {
                return res.status(400).json({ error: 'Campos obrigatórios faltando' });
            }

            const newUser = await service.createUser({
                matricula,
                nome,
                cpf,
                senha,
                tipo,
                data_entrada,
            });

            res.status(201).json(newUser);
        } catch (err) {
            console.error('Erro ao criar usuário:', err);

            res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    },

    
    login: async (req, res) => {
        try {
            const { cpf, senha } = req.body;

            if (!cpf || !senha) {
                return res.status(400).json({ error: 'CPF e senha são obrigatórios' });
            }

            const user = await service.Getuser(cpf, senha);

            if (!user) {
                return res.status(401).json({ error: 'CPF ou senha inválidos' });
            }

            return res.status(200).json({
                id_usuario: user.id_usuario,
                nome: user.nome,
                cpf: user.cpf,
                tipo: user.tipo,
            });
        } catch (err) {
            console.error('Erro no login:', err);
            return res.status(500).json({ error: 'Erro ao realizar login' });
        }
    },
    // Editar usuário
    updateTipo: async (req, res) => {
        try {
            const { id } = req.params;
            const { tipo } = req.body;

            if (typeof tipo !== 'number') {
                return res.status(400).json({ error: 'Campo "tipo" é obrigatório e deve ser numérico' });
            }

            const result = await service.updateUserTipo(id, tipo);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.status(200).json({ message: 'Tipo atualizado com sucesso' });
        } catch (err) {
            console.error('Erro ao atualizar tipo do usuário:', err);
            return res.status(500).json({ error: 'Erro ao atualizar tipo do usuário' });
        }
    },

    // Excluir usuário
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            const result = await service.deleteUser(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.status(200).json({ message: 'Usuário excluído com sucesso' });
        } catch (err) {
            console.error('Erro ao excluir usuário:', err);
            return res.status(500).json({ error: 'Erro ao excluir usuário' });
        }
    },
    
        // Editar nome e/ou senha do próprio usuário
    updateDados: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, senha } = req.body;

            if (!nome && !senha) {
                return res.status(400).json({ error: 'Informe ao menos nome ou senha para atualizar.' });
            }

            const result = await service.updateUserDados(id, {
                nome: nome || undefined,
                senha: senha || null,
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.status(200).json({ message: 'Dados atualizados com sucesso' });
        } catch (err) {
            console.error('Erro ao atualizar dados do usuário:', err);
            return res.status(500).json({ error: 'Erro ao atualizar dados do usuário' });
        }
    },



};

module.exports = controller;
