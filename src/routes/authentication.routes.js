import express from "express";

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('auth/login', { styles: '<link rel="stylesheet" href="/css/login.css">' });
});

export default router;