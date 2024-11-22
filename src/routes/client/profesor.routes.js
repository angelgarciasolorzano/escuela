import express from "express";
import { isLoggedIn, checkRol } from "../../lib/middleware/auth.js";
import pool from "../../database.js";

const router = express.Router();

export default router;