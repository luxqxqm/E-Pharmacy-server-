import { Router } from 'express';
import {
  getNearestStores,
  getStores,
} from '../controllers/storesController.js';

const storesRouter = Router();

storesRouter.get('/', getStores);
storesRouter.get('/nearest', getNearestStores);

export default storesRouter;
