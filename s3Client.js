import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const { config, S3 } = AWS;

config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "eu-west-2",
});

const s3 = new S3();

export default s3;
