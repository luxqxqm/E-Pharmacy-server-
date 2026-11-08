import { Router } from 'express';
import {
  getProducts,
  getProductById,
} from '../controllers/productsController.js';
import { celebrate } from 'celebrate';
import {
  getProductsSchema,
  productIdSchema,
} from '../validation/productsValidation.js';

const productsRouter = Router();

productsRouter.get('/', celebrate(getProductsSchema), getProducts);
productsRouter.get('/:productId', celebrate(productIdSchema), getProductById);

export default productsRouter;
