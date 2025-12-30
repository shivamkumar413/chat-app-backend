import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { connectDB } from './config/db.config.js';
import { PORT } from './config/server.config.js';
import { isAuthenticated } from './middlewares/auth.middleware.js';
import apiRouter from './routes/apiRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.get('/ping', isAuthenticated, (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong'
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
