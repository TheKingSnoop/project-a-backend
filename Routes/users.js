import express from "express";
import { GetUsers } from "../Functions/users.js";
import userSchema from "../schemas/user.js";

const router = express.Router();

router.get("/all-users", async (req, res) => {
  try {
    const users = await userSchema.find();
    if (users) {
      res.status(200).send(users);
    } else {
      res.status(500).send({
        success: false,
        message: "No users found",
      });
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
    const { name, surname, email, password } = req.body;
    const isExistingUser = await userSchema.exists({ email: email });
    if (isExistingUser) {
      return res.status(400).send({
        success: false,
        message: "Email already registered",
      });
    }
    const newUser = new userSchema({
      name,
      surname,
      email,
      password
    });

    await newUser.save();

    res.status(201).send({
      success: true,
      message: "User added successfully",
      user: newUser
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
