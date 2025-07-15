import express from "express";
import usersRouter from './Routes/users.js'
import s3 from './s3Client.js';
import invoicesRouter from './Routes/invoices.js';

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/users', usersRouter);

app.use('/invoices', invoicesRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/test-s3', async (req, res) => {
  try {
    const buckets = await s3.listBuckets().promise();
    res.json({
      message: 'S3 Buckets Retrieved Successfully',
      buckets: buckets.Buckets
    });
  } catch (error) {
    console.error('Error connecting to S3:', error);
    res.status(500).json({ message: 'S3 connection failed', error: error.message });
  }

});
