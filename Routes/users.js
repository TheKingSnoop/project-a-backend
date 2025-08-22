import express from "express";
import { GetUsers } from "../Functions/users.js";

const router = express.Router();

router.get("/all-users", async (req, res) => {
  try {
    const users = await GetUsers();
    if (users.success) {
      res.status(200).send(users);
    } else {
      res.status(500).send(users);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error.message",
    });
  }
});

export default router;
