import express from "express";
import { AddClient } from "../Functions/clients.js";


const router = express.Router();

router.post("/add", async (req, res) => {
  const { userId, clientData } = req.body;
  const result = await AddClient(userId, clientData);
  res.json(result);
});

export default router;