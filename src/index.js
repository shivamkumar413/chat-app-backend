import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { connectDB } from './config/db.config.js';
import { PORT } from './config/server.config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong'
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
