create database gestorDeCursos;
use gestorDeCursos; 

create table usuario(
id_usuario   INT AUTO_INCREMENT PRIMARY KEY,
matricula varchar(10) UNIQUE,
nome varchar(100) NOT NULL,
cpf char(11) NOT NULL UNIQUE,
senha varchar(100) NOT NULL,
tipo int NOT NULL,
data_entrada DATE NOT NULL
);


create table curso(
	id_curso int auto_increment primary key,
    nome varchar(50) NOT NULL, 
	descricao TEXT,
    carga_horaria int not null,
    ativo boolean default true,
    CONSTRAINT chk_carga_horaria CHECK (carga_horaria > 0)
);


create table periodo(
	id_periodo int auto_increment primary key,
    codigo varchar(10) not null unique,
    nome varchar(50) not null unique,
    data_inicio date not null,
    data_fim date not null,
    ativo boolean default true,
    constraint chk_periodo_data check (data_fim > data_inicio)
);

create table turma(
	id_turma int auto_increment primary key,
    id_periodo int not null,
	id_curso int not null,
    id_professor int not null,
    nome varchar(50) not null unique,
    codigo_turma varchar(10) not null unique,
    vagas_regulares int not null default 30,
    vagas_extras int not null default 10,
    ativo boolean default true,
	status_inscricoes enum('aberta','fechada') not null default 'aberta',
    constraint fk_turma_periodo foreign key (id_periodo) references periodo(id_periodo) ON DELETE RESTRICT,   
	constraint fk_turma_curso foreign key (id_curso) references curso(id_curso) ON DELETE RESTRICT,			/* impede de deletar um curso que esteja num periodo*/
	constraint fk_turma_professor foreign key (id_professor) references usuario(id_usuario) ON DELETE RESTRICT   /* impede de deletar um professor que esteja numa turma*/
);



create table aluno_curso(
	id_aluno_curso int auto_increment primary key,
    id_aluno int not null,
    id_curso int not null,
    id_turma int not null,
    tentativas int not null default 0,
    p1 decimal(4,2) default NULL,
    p2 decimal(4,2) default NULL,
    pf decimal(4,2) default NULL,
    media_final decimal(4,2) default null,
    status enum('cursando', 'concluido', 'incompleto') DEFAULT 'incompleto',
    constraint fk_aluno_curso foreign key (id_aluno) references usuario(id_usuario) on delete cascade,
    constraint fk_curso foreign key (id_curso) references curso(id_curso) on delete cascade,
    constraint fk_hist_turma FOREIGN KEY (id_turma) REFERENCES turma(id_turma) ON DELETE CASCADE

);

create table historico_aluno (
	id_historico int auto_increment primary key,
    id_aluno int not null,
    id_curso int not null,
    id_turma int not null,
    nome_curso varchar(50) not null,
    codigo_periodo varchar(10),
    nome_turma varchar(50) not null,
    media_final DECIMAL(4,2) not null,
    status ENUM('Aprovado', 'Reprovado') not null,
    data_status DATE not null,
    CONSTRAINT fk_hist_aluno FOREIGN KEY (id_aluno)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_hist_curso FOREIGN KEY (id_curso)
        REFERENCES curso(id_curso) ON DELETE CASCADE
);

CREATE TABLE inscricao_turma (
    id_inscricao INT AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    id_turma INT NOT NULL,
    tentativas_anteriores INT NOT NULL DEFAULT 0,
    data_inscricao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'aprovado', 'rejeitado') NOT NULL DEFAULT 'pendente',
	CONSTRAINT uq_inscricao UNIQUE (id_aluno, id_turma),
    CONSTRAINT fk_insc_aluno FOREIGN KEY (id_aluno)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_insc_turma FOREIGN KEY (id_turma)
        REFERENCES turma(id_turma) ON DELETE CASCADE
);


CREATE TABLE material_aula (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    id_turma INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo ENUM('apostila', 'slide', 'video', 'link', 'outro') NOT NULL DEFAULT 'outro',
    caminho_arquivo VARCHAR(255),      -- pode ser caminho, URL, etc.
    data_publicacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_material_turma
        FOREIGN KEY (id_turma) REFERENCES turma(id_turma)
        ON DELETE CASCADE
);

CREATE TABLE atividade_avaliativa (
    id_atividade INT AUTO_INCREMENT PRIMARY KEY,
    id_turma INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo ENUM('trabalho', 'prova', 'exercicio') NOT NULL,
    data_publicacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_limite DATETIME NOT NULL,
    valor DECIMAL(4,2) NOT NULL DEFAULT 10.00,   -- nota máxima da atividade
    permite_atraso BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_atividade_turma
        FOREIGN KEY (id_turma) REFERENCES turma(id_turma)
        ON DELETE CASCADE
);
CREATE TABLE resposta_atividade (
    id_resposta INT AUTO_INCREMENT PRIMARY KEY,
    id_atividade INT NOT NULL,
    id_aluno INT NOT NULL,
    data_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    conteudo_resposta TEXT,        -- texto, link, etc. Opcional se usar só arquivo
    caminho_arquivo VARCHAR(255),  -- caminho/URL de upload, se tiver
    atrasada BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT uq_resposta_atividade UNIQUE (id_atividade, id_aluno),

    CONSTRAINT fk_resp_atividade
        FOREIGN KEY (id_atividade) REFERENCES atividade_avaliativa(id_atividade)
        ON DELETE CASCADE,

    CONSTRAINT fk_resp_aluno
        FOREIGN KEY (id_aluno) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);
DELIMITER //

CREATE TRIGGER chk_resposta_atividade
BEFORE INSERT ON resposta_atividade
FOR EACH ROW
BEGIN
    DECLARE v_id_turma INT;
    DECLARE v_data_limite DATETIME;
    DECLARE v_matricula INT;

    -- Garante data_envio preenchida
    IF NEW.data_envio IS NULL THEN
        SET NEW.data_envio = NOW();
    END IF;

    -- 1) pega turma e prazo da atividade
    SELECT id_turma, data_limite
    INTO v_id_turma, v_data_limite
    FROM atividade_avaliativa
    WHERE id_atividade = NEW.id_atividade;

    IF v_id_turma IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Atividade inexistente.';
    END IF;

    -- 2) verifica se o aluno esta matriculado na turma dessa atividade
    SELECT COUNT(*)
    INTO v_matricula
    FROM aluno_curso
    WHERE id_aluno = NEW.id_aluno
      AND id_turma = v_id_turma;

    IF v_matricula = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Aluno nao esta matriculado na turma desta atividade.';
    END IF;

    -- 3) verifica atraso
    IF NEW.data_envio > v_data_limite THEN
        SET NEW.atrasada = TRUE;
    ELSE
        SET NEW.atrasada = FALSE;
    END IF;

END//

DELIMITER ;


DELIMITER //
CREATE TRIGGER trg_calcula_media
BEFORE UPDATE ON aluno_curso
FOR EACH ROW
BEGIN
    DECLARE v_media_p12      DECIMAL(4,2);
    DECLARE v_media_final    DECIMAL(4,2);
    DECLARE v_nome_turma     VARCHAR(50);
    DECLARE v_codigo_periodo VARCHAR(10);
    DECLARE v_nome_curso     VARCHAR(50);

    -- Busca os dados da turma/curso/periodo para gravar no histórico
    SELECT 
        c.nome,        -- nome do curso
        t.nome,        -- nome da turma
        p.codigo       -- código do período
    INTO 
        v_nome_curso,
        v_nome_turma,
        v_codigo_periodo
    FROM turma t
    JOIN curso c 
        ON c.id_curso = t.id_curso
    JOIN periodo p
        ON p.id_periodo = t.id_periodo
    WHERE t.id_turma = NEW.id_turma;

    -- Só processa se P1 e P2 foram preenchidas
    IF NEW.p1 IS NOT NULL AND NEW.p2 IS NOT NULL THEN
        
        SET v_media_p12 = (NEW.p1 + NEW.p2)/2;

        -- Caso 1: Não precisa PF (média >= 7)
        IF v_media_p12 >= 7 THEN
            SET NEW.pf          = v_media_p12;
            SET NEW.media_final = v_media_p12;
            SET NEW.status      = 'concluido';

            INSERT INTO historico_aluno (
                id_aluno,
                id_curso,
                id_turma,
                nome_curso,
                codigo_periodo,
                nome_turma,
                media_final,
                status,
                data_status
            ) VALUES (
                NEW.id_aluno,
                NEW.id_curso,
                NEW.id_turma,
                v_nome_curso,
                v_codigo_periodo,
                v_nome_turma,
                v_media_p12,
                'Aprovado',
                CURDATE()
            );

        -- Caso 2: média < 7, mas PF já foi preenchida
        ELSEIF v_media_p12 < 7 AND NEW.pf IS NOT NULL THEN
            SET v_media_final   = (v_media_p12 + NEW.pf)/2;
            SET NEW.media_final = v_media_final;

            IF v_media_final >= 5 THEN
                -- aprovado via PF
                SET NEW.status = 'concluido';

                INSERT INTO historico_aluno (
                    id_aluno,
                    id_curso,
                    id_turma,
                    nome_curso,
                    codigo_periodo,
                    nome_turma,
                    media_final,
                    status,
                    data_status
                ) VALUES (
                    NEW.id_aluno,
                    NEW.id_curso,
                    NEW.id_turma,
                    v_nome_curso,
                    v_codigo_periodo,
                    v_nome_turma,
                    v_media_final,
                    'Aprovado',
                    CURDATE()
                );
            ELSE

                INSERT INTO historico_aluno (
                    id_aluno,
                    id_curso,
                    id_turma,
                    nome_curso,
                    codigo_periodo,
                    nome_turma,
                    media_final,
                    status,
                    data_status
                ) VALUES (
                    NEW.id_aluno,
                    NEW.id_curso,
                    NEW.id_turma,
                    v_nome_curso,
                    v_codigo_periodo,
                    v_nome_turma,
                    v_media_final,
                    'Reprovado',
                    CURDATE()
                );
                
                 -- Reset completo
                SET NEW.tentativas  = OLD.tentativas + 1;
                SET NEW.p1          = NULL;
                SET NEW.p2          = NULL;
                SET NEW.pf          = NULL;
                SET NEW.media_final = NULL;
                SET NEW.status      = 'incompleto';
                
            END IF;

        ELSE
            -- P1 e P2 lançadas, média < 7 e ainda sem PF => continua cursando
            SET NEW.status = 'cursando';
        END IF;
    END IF;
END//
DELIMITER ;


DELIMITER //

DROP TRIGGER IF EXISTS chk_inscricao_turma;
//


DELIMITER //

CREATE TRIGGER trg_periodo_desativa
AFTER UPDATE ON periodo
FOR EACH ROW
BEGIN
    -- Só executa quando ativo muda de TRUE -> FALSE
    IF OLD.ativo = TRUE AND NEW.ativo = FALSE THEN
        
        -- 1) Desativar TODAS as turmas do período
        -- Desativa TODAS as turmas do período encerrado/desativado
        UPDATE turma
        SET ativo = FALSE
        WHERE id_periodo = NEW.id_periodo;

        -- 2) Desativar TODOS os cursos usados pelas turmas desse período
        UPDATE curso
        SET ativo = FALSE
        WHERE id_curso IN (
            SELECT id_curso
            FROM turma
            WHERE id_periodo = NEW.id_periodo
        );

    END IF;
END//

DELIMITER ;

DELIMITER //

DROP TRIGGER IF EXISTS trg_processa_inscricoes_turma;
//
CREATE TRIGGER trg_processa_inscricoes_turma
AFTER UPDATE ON turma
FOR EACH ROW
BEGIN
    DECLARE v_vagas_regulares INT;
    DECLARE v_vagas_extras INT;

    -- Só roda quando as inscricoes mudam de 'aberta' -> 'fechada'
    IF OLD.status_inscricoes = 'aberta'
       AND NEW.status_inscricoes = 'fechada' THEN

        SET v_vagas_regulares = NEW.vagas_regulares;
        SET v_vagas_extras    = NEW.vagas_extras;

        -- 1) Reprocessa status de TODOS os inscritos, ordenando pela prioridade
        UPDATE inscricao_turma it
        JOIN (
            SELECT 
                id_inscricao,
                ROW_NUMBER() OVER (
                    PARTITION BY id_turma
                    ORDER BY tentativas_anteriores DESC,
                             data_inscricao ASC
                ) AS pos
            FROM inscricao_turma
            WHERE id_turma = NEW.id_turma
        ) x ON x.id_inscricao = it.id_inscricao
        SET it.status = CASE
            WHEN x.pos <= v_vagas_regulares THEN 'aprovado'
            WHEN x.pos <= v_vagas_regulares + v_vagas_extras THEN 'pendente'
            ELSE 'rejeitado'
        END;

        -- 2) Cria linha em aluno_curso apenas para os APROVADOS
        --    SEM alterar tentativas, pois isso é função do outro trigger
        INSERT INTO aluno_curso (
            id_aluno,
            id_curso,
            id_turma,
            status
        )
        SELECT 
            it.id_aluno,
            NEW.id_curso,
            NEW.id_turma,
            'cursando'
        FROM inscricao_turma it
        LEFT JOIN aluno_curso ac
          ON ac.id_aluno = it.id_aluno
         AND ac.id_turma = NEW.id_turma
        WHERE it.id_turma = NEW.id_turma
          AND it.status = 'aprovado'
          AND ac.id_aluno IS NULL;   -- só cria se ainda não tiver linha

    END IF;
END//
DELIMITER ;

-- ==========================================================
-- DADOS INICIAIS / SEED DATA (Para testes imediatos)
-- ==========================================================

-- Usuários:
-- 1) Administrador (tipo 4) - CPF: 00000000000 | Senha: admin123
-- 2) Professor (tipo 2)     - CPF: 11111111111 | Senha: prof123
-- 3) Aluno (tipo 1)         - CPF: 22222222222 | Senha: aluno123
INSERT INTO usuario (matricula, nome, cpf, senha, tipo, data_entrada) VALUES
('ADM001', 'Administrador do Sistema', '00000000000', 'admin123', 4, CURDATE()),
('PRF001', 'Prof. Carlos Silva', '11111111111', 'prof123', 2, CURDATE()),
('ALN001', 'Mariana Souza (Aluna)', '22222222222', 'aluno123', 1, CURDATE());

-- Curso de exemplo
INSERT INTO curso (nome, descricao, carga_horaria, ativo) VALUES
('Engenharia de Software', 'Bacharelado com foco em arquitetura, código limpo e processos ágeis', 3600, TRUE),
('Banco de Dados Avançado', 'Modelagem relacional, índices, triggers e stored procedures', 80, TRUE);

-- Período acadêmico de exemplo
INSERT INTO periodo (codigo, nome, data_inicio, data_fim, ativo) VALUES
('2026.1', 'Primeiro Semestre 2026', '2026-02-01', '2026-06-30', TRUE);

-- Turma de exemplo vinculada ao período 1, curso 1 e professor 2
INSERT INTO turma (id_periodo, id_curso, id_professor, nome, codigo_turma, vagas_regulares, vagas_extras, ativo, status_inscricoes) VALUES
(1, 1, 2, 'Engenharia de Software - Turma A', 'ES2026-1A', 30, 5, TRUE, 'aberta');

