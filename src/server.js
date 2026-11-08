// src/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import productsRouter from './routes/productsRoutes.js';
import { errors } from 'celebrate';
import storeRouter from './routes/storesRoutes.js';
import reviewsRouter from './routes/reviewsRoutes.js';
import userRouter from './routes/usersRoutes.js';
import cartRouter from './routes/cartRoutes.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(logger);
app.use(express.json());
app.use(cors());
app.use('/api/products', productsRouter);
app.use('/api/stores', storeRouter);
app.use('/api/customer-reviews', reviewsRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
