const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs'); // criptografar senhas
const EmpresaJunior = require('./models/EmpresaJunior'); // modelo da ej
const routes = require('./routes/routes'); // tem que verificar se o caminho está certo
const authRoutes = require('./routes/authRoutes');
const path = require('path'); // lida com caminhos de arquivos

// inicializa o express
const app = express();

// configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.static(path.join(__dirname, 'public'))); // serve arquivos estáticos
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// middleware para definir a variável 'user' em todas as views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// middleware de autenticação
function verificarAutenticacao(req, res, next) {
  if (!req.session.empresaLogada) {
    return res.redirect('/login'); // se não estiver autenticado, redireciona para o login
  }
  next(); // se estiver autenticado, continua o processamento da rota
}

// rotas de autenticação
app.get('/login', (req, res) => {
  res.render('auth/login'); // página de login
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const ej = await EmpresaJunior.findOne({ where: { Email: email } });

    if (ej) {
      const senhaValida = await bcrypt.compare(senha, ej.Senha);
      if (senhaValida) {
        req.session.empresaLogada = ej.CNPJ; // armazena o CNPJ na sessão
        return res.redirect('/perfil'); // redireciona para o perfil
      }
    }
    res.render('auth/login', { error: 'Email ou senha incorretos.' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.render('auth/login', { error: 'Ocorreu um erro. Tente novamente.' });
  }
});

app.get('/registro', (req, res) => {
  res.render('auth/registro'); // página de registro
});

app.post('/registro', async (req, res) => {
  const { CNPJ, Nome, Email, Senha, Status, DataCriada } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(Senha, salt);

    await EmpresaJunior.create({
      CNPJ,
      Nome,
      Email,
      Senha: senhaCriptografada,
      Status: Status === 'ativo', // define true ou false
      DataCriada,
    });

    res.redirect('/login'); // depois do registro, redireciona para login
  } catch (error) {
    console.error('Erro no registro:', error);
    res.render('auth/registro', { error: 'Erro ao cadastrar. Tente novamente.' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login'); // redireciona para login depois do logout
});

// Rota protegida: perfil
app.get('/perfil', verificarAutenticacao, (req, res) => {
  res.render('perfil', { CNPJ: req.session.empresaLogada }); // Exemplo de como acessar a sessão
});

// outras rotas
app.use('/', routes); // rotas de projetos
app.use('/auth', authRoutes); // rotas de autenticação

// inicialização do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
