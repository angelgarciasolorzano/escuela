import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.render('inicio', { styles: '<link rel="stylesheet" href="/css/inicio.css">' });
});

export default router;