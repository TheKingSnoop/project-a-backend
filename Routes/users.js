import express from "express";
import { AddUser, GetUsers } from "../Functions/users.js";
import userSchema from "../Schemas/user.js";

const router = express.Router();

router.get("/all-users", async (req, res) => {
  try {
    const result = await GetUsers();

    if (result.success) {
      res.status(200).send(result);
    } else {
      res.status(500).send(result);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/add-user", async (req, res) => {
  try {
    const newUserData = req.body;
    const result = await AddUser(newUserData)
    if (result.success) {
      res.status(201).send(result);
    } else {
      res.status(500).send(result)
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
