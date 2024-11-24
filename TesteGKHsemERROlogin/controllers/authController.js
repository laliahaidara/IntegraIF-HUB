const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configuração do Passport com a API do Google
passport.use(new GoogleStrategy({
    clientID: '930940771170-josk20msqsrffe9v9svrn9lc7f5lco7b.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    // A função 'done' é chamada após a autenticação bem-sucedida
    // Aqui, você pode salvar o perfil no banco de dados ou apenas passar o perfil para o Passport
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Função para exibir o formulário de login
exports.login = (req, res) => {
    res.render('auth/login');  // Renderiza a página de login
};

// Função de autenticação com o Google
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Função de callback após autenticação do Google
exports.googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/login', // Se falhar, redireciona para o login
    successRedirect: '/'        // Se sucesso, redireciona para a home
});

// Função de logout
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);  // Em caso de erro no logout
        }
        res.redirect('/');  // Após o logout, redireciona para a página inicial
    });
};
