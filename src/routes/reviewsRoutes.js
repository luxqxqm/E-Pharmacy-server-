import { Router } from 'express';
import { getReviews } from '../controllers/reviewsController.js';

const reviewsRouter = Router();

reviewsRouter.get('/', getReviews);
export default reviewsRouter;
