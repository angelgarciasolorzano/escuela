import express from "express";

const router = express.Router();

router.get('/nav', (req, res) => {
  const navbarTemplate = 'navcaja';
  res.render('auth/login', { navbarTemplate: navbarTemplate });
});

export default router;