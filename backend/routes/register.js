import express from "express";
import userRegister from "../controllers/userRegister.js"

const router = express.Router();

router.post('/register', userRegister);

export default router;