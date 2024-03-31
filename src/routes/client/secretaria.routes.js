import express from "express";

const router = express.Router();

router.get('/nav', (req, res) => {
  const navbarTemplate = 'navcaja';
  res.render('auth/login', { styles: '<link rel="stylesheet" href="/css/login.css">', navbarTemplate: navbarTemplate });
});

export default router;