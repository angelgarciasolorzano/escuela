import express from "express";

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('auth/login', { styles: '<link rel="stylesheet" href="/css/login.css">' });
});

router.post('/login', (req, res) => {
  const { usuario, contra, cargo } = req.body;
  console.log(usuario, contra, cargo);
});

export default router;