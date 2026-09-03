# 🗄️ Modelagem do Banco de Dados - Gestor de Cursos

Este diretório contém os scripts de definição de dados (DDL), gatilhos (triggers) e dados semente (seed data) do sistema **Gestor de Cursos**.

---

## 📌 Visão Geral das Tabelas

| Tabela | Descrição |
| :--- | :--- |
| `usuario` | Contas de usuários (Alunos, Professores, Administradores). Utiliza **Bitmask** no campo `tipo`. |
| `curso` | Cadastro de cursos (ex: Engenharia de Software, Ciência da Computação). |
| `periodo` | Períodos letivos (ex: `2026.1`, `2026.2`) com data de início e fim. |
| `turma` | Turmas vinculadas a um curso, período e professor responsável. Controla vagas regulares e extras. |
| `aluno_curso` | Matrículas ativas dos alunos em turmas com acompanhamento de notas (`P1`, `P2`, `PF`, `Média Final`). |
| `historico_aluno` | Registro histórico imutável das disciplinas concluídas/reprovadas pelo aluno. |
| `inscricao_turma` | Fila de solicitações de matrícula com status (`pendente`, `aprovado`, `rejeitado`). |
| `material_aula` | Apostilas, slides, links e vídeos disponibilizados na turma. |
| `atividade_avaliativa` | Trabalhos, provas e exercícios com prazo e nota máxima. |
| `resposta_atividade` | Entregas e uploads dos alunos para as atividades propostas. |

---

## ⚙️ Triggers Automatizados

O banco conta com regras de negócio críticas implementadas nativamente no MySQL:

1. **`trg_calcula_media` (Tabela `aluno_curso`)**:
   - Disparado antes da atualização de notas.
   - Quando `P1` e `P2` são lançadas:
     - Se `(P1 + P2)/2 >= 7.0`: Aprova o aluno automaticamente, registra no `historico_aluno` e define status `'concluido'`.
     - Se média $< 7.0$ e a Prova Final (`PF`) for preenchida:
       - Se `(Média + PF)/2 >= 5.0`: Aprova o aluno e grava no histórico.
       - Se reprovado: Registra reprovação no histórico, incrementa o contador de tentativas e reseta as notas para nova tentativa.

2. **`trg_processa_inscricoes_turma` (Tabela `turma`)**:
   - Disparado quando `status_inscricoes` muda de `'aberta'` para `'fechada'`.
   - Classifica os alunos inscritos por ordem de prioridade (tentativas anteriores descendente, ordem de inscrição ascendente).
   - Aprova até o limite de vagas regulares, mantém vagas extras como pendente (lista de espera) e rejeita os excedentes.
   - Cria automaticamente as linhas na tabela `aluno_curso` para os alunos aprovados.

3. **`trg_periodo_desativa` (Tabela `periodo`)**:
   - Quando um período letivo é encerrado (`ativo = FALSE`), todas as turmas vinculadas a ele são automaticamente desativadas.

4. **`chk_resposta_atividade` (Tabela `resposta_atividade`)**:
   - Valida se o aluno está devidamente matriculado na turma antes de enviar a resposta e marca automaticamente se a entrega ocorreu com atraso.

---

## 🎭 Sistema de Permissões (Bitmask)

O campo `tipo` da tabela `usuario` utiliza operadores bitwise para permitir papéis únicos ou combinados:

- `1` (`001` em binário): **Aluno**
- `2` (`010` em binário): **Professor**
- `4` (`100` em binário): **Administrador**
- `3` (`011` em binário): **Aluno + Professor**
- `7` (`111` em binário): **Acesso Total**

---

## 🚀 Como Executar o Script

No terminal com o MySQL ativo:

```bash
mysql -u root -p < database/schema.sql
```
