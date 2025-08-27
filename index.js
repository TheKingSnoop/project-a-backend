import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./Routes/users.js";
import s3 from "./s3Client.js";
import invoicesRouter from "./Routes/invoices.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow requests from frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API for Project A is running");
});

app.use("/users", usersRouter);

app.use("/invoices", invoicesRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/test-s3", async (req, res) => {
  try {
    const buckets = await s3.listBuckets().promise();
    res.json({
      message: "S3 Buckets Retrieved Successfully",
      buckets: buckets.Buckets,
    });
  } catch (error) {
    console.error("Error connecting to S3:", error);
    res.status(500).json({ message: "S3 connection failed", error: error.message });
  }
});
