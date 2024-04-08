import express from "express";
import { isLoggedIn, isNotLoggedIn } from "../../lib/middleware/auth.js";

const router = express.Router();

router.get('/secretaria', isLoggedIn, (req, res) => {
  res.render('interface/client/perfilsecret');
});
// router.get('/:id', isNotLoggedIn, (req, res) => {
//   res.render('interface/client/perfilsecret');
// }); 

router.get('/secretaria/registro', isLoggedIn, (req, res) => {
  res.render('interface/client/addestudiantes');
});

router.post('/secretaria/registro', (req, res) => {
  console.log(req.body);
})

export default router;