import express from "express";

const router = express.Router();

router.get('/nav', (req, res) => {
  const navbarTemplate = 'navsecret';
  res.render('interface/client/perfilsecret', { 
    styles: '<link rel="stylesheet" href="/css/client/navsecret.css"><link rel="stylesheet" href="/css/client/perfilsecret.css">', 
    navbarTemplate: navbarTemplate 
  });
});

export default router;