import express from "express";
import { isLoggedIn, isNotLoggedIn } from "../../lib/middleware/auth.js";

const router = express.Router();

router.get('/secretaria', isLoggedIn, (req, res) => {
  res.render('interface/client/perfilsecret', { 
    styles: '<link rel="stylesheet" href="/css/client/navsecret.css"><link rel="stylesheet" href="/css/client/perfilsecret.css">' 
  });
});

router.get('/secretaria/registro', isLoggedIn, (req, res) => {
  res.render('interface/client/addestudiantes', { 
    styles: '<link rel="stylesheet" href="/css/client/navsecret.css"><link rel="stylesheet" href="/css/client/addestudiantes.css">' 
  });
});

router.post('/secretaria/registro', (req, res) => {
  console.log(req.body);
})

export default router;