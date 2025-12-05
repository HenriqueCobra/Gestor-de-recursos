const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
const userRouter = require('./routes/routeUser');  // delcarando rota usuarios (acessando a pasta)
const cursoRouter = require('./routes/routeCurso');
const periodoRouter = require('./routes/routePeriodo');
const turmaRouter = require('./routes/routeTurma');
const alunoCursoRouter = require('./routes/routeAlunoCurso');
const historicoAlunoRouter = require('./routes/routeHistoricoAluno');
const materialAulaRouter = require('./routes/routeMaterialAula');
const atividadeAvaliativaRouter = require('./routes/routeAtividadeAvaliativa');
const respostaAtividadeRouter = require('./routes/routeRespostaAtividade');
const alunoRouter     = require('./routes/routeAluno');
const inscricaoRouter = require('./routes/routeInscricao');

app.get('/', (req , res) => res.send('eusouget'));
app.use('/user', userRouter);  //criando a url da rota
app.use('/curso', cursoRouter);
app.use('/periodo', periodoRouter);
app.use('/turma', turmaRouter);
app.use('/aluno_curso', alunoCursoRouter);
app.use('/historico_aluno', historicoAlunoRouter);
app.use('/material_aula', materialAulaRouter);
app.use('/atividade_avaliativa', atividadeAvaliativaRouter);
app.use('/resposta_atividade', respostaAtividadeRouter);
app.use('/aluno',      alunoRouter);
app.use('/inscricoes', inscricaoRouter);


app.listen(3001, () => console.log('serivodr rodando na porta 3001'));

