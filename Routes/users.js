import express from "express";
import { AddUser, generateAccessToken, GetUsers, Login, UpdateUser, GetUserById } from "../Functions/users.js";
import jwt from 'jsonwebtoken';

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

router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await GetUserById(userId);
    if (result.success) {
      res.status(200).send(result);
    } else {
      res.status(404).send(result);
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

router.post("/login", async (req, res) => {
  try {
    const loginData = req.body;
    const result = await Login(loginData);
    if (result.success) {
      res.status(200).send(result);
    } else {
      res.status(401).send(result);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/refresh-token", (req, res) => {
  const { token, refreshToken } = req.body;

  if (!token || !refreshToken) {
    return res.status(400).send({
      success: false,
      message: "Token and refresh token are required",
    });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken({ id: user.id, name: user.name });
    res.send({
      success: true,
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    });
  });
});

router.put("/update-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const result = await UpdateUser(userId, updateData);
    if (result.success) {
      res.status(200).send(result);
    } else {
      res.status(404).send(result);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

export default router;