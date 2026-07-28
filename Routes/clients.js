import express from "express";
import { AddClient, GetClientList } from "../Functions/clients.js";

const router = express.Router();

router.get("/list/:userId", async (req, res) => {
  const userId = req.params.userId;
  const result = await GetClientList(userId);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

router.post("/add/:id", async (req, res) => {
  const { id: userId } = req.params;
  const clientData  = req.body;
  const result = await AddClient(userId, clientData);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
});

export default router;
