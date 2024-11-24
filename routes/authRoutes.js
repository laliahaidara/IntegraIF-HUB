const express = require('express');
const bcrypt = require('bcryptjs');
const EmpresaJunior = require('../models/EmpresaJunior');
const router = express.Router();

// rota POST para cadastrar a ej
router.post('/cadastro', async (req, res) => {
  const { CNPJ, Nome, Status, DataCriada, Email, Senha } = req.body;

  try {
    // verifica se já existe uma ej com o mesmo cnpj
    const existente = await EmpresaJunior.findOne({ where: { CNPJ } });
    if (existente) {
      return res.render('auth/register', { 
        error: 'Já existe uma Empresa Júnior registrada com este CNPJ.' 
      });
    }

    // gera o hash da senha (criptografa)
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(Senha, salt);

    // cria a nova ej no banco de dados
    await EmpresaJunior.create({
      CNPJ,
      Nome,
      Status,
      DataCriada,
      Email,
      Senha: senhaCriptografada,
    });

    // redireciona p pag de login dps do cadastro
    res.status(201).redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar Empresa Junior.');
  }
});

// rota POST p registro no formato `/register`
router.post('/register', async (req, res) => {
  const { CNPJ, Nome, Email, Senha, DataCriada } = req.body;

  try {
    // valida se o cnpj ou email já foi cadastrado
    const existente = await EmpresaJunior.findOne({ where: { CNPJ } });
    if (existente) {
      return res.render('auth/register', { 
        error: 'Já existe uma Empresa Júnior registrada com este CNPJ.' 
      });
    }

    const existenteEmail = await EmpresaJunior.findOne({ where: { Email } });
    if (existenteEmail) {
      return res.render('auth/register', { 
        error: 'Já existe uma Empresa Júnior registrada com este email.' 
      });
    }

    // gera o hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(Senha, salt);

    // cria o registro
    await EmpresaJunior.create({
      CNPJ,
      Nome,
      Status: true, // define status como ativo por padrão
      DataCriada,
      Email,
      Senha: senhaCriptografada,
    });

    // redireciona p pag de login dps do registro
    res.status(201).redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao registrar Empresa Júnior.');
  }
});

// rota POST p login de ej
router.post('/login', async (req, res) => {
  const { Email, Senha } = req.body;

  try {
    // busca a ej pelo email
    const ej = await EmpresaJunior.findOne({ where: { Email } });

    if (!ej) {
      return res.render('auth/login', { error: 'Email ou senha incorretos.' });
    }

    // valida a senha
    const senhaValida = await bcrypt.compare(Senha, ej.Senha);

    if (senhaValida) {
      req.session.empresaLogada = ej.CNPJ; // salva o cnpj na sessão
      res.redirect('/perfil'); // redireciona p pag de perfil
    } else {
      res.render('auth/login', { error: 'Email ou senha incorretos.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao processar login.');
  }
});

module.exports = router;
