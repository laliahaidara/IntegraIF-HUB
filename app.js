const express = require('express');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes/routes'); // Certifique-se de que o caminho esteja correto
const authRoutes = require('./routes/authRoutes');
const path = require('path'); // Para lidar com caminhos de arquivos

// Inicialização do Express
const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));


// Middleware para definir a variável 'user' em todas as views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Rotas
app.use('/', routes); // Rotas de projetos
// app.use('/routes',authRoutes);  // Rotas de autenticação (login, logout, etc.)
app.use('/auth', authRoutes); // teste da mavinha

// Inicialização do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));