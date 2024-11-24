const express = require('express');
const router = express.Router();
// Rota para a página inicial
router.get('/', (req, res) => {
  const projects = [
    { title: "Projeto 1", description: "Descrição do Projeto 1" },
    { title: "Projeto 2", description: "Descrição do Projeto 2" },
    { title: "Projeto 3", description: "Descrição do Projeto 3" }
  ];

  res.render('home', { 
    user: req.user,  // Passando o usuário logado
    projects: projects // Passando os projetos
  });
});


router.get('/about', (req, res) => {
  res.render('about'); // A view 'about.ejs' deve estar na pasta 'views'
});

router.get('/contact', (req, res) => {
  res.render('contact'); // A view 'about.ejs' deve estar na pasta 'views'
});

//router.get('/login', (req, res) => {
 // res.render('auth/login');  // Agora busca dentro da pasta 'auth'
//}); ta comentado pq eh teste da mavinha

module.exports = router;
