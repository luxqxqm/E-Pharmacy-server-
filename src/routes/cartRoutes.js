import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  checkout,
  getCart,
  updateCart,
} from '../controllers/cartController.js';
import {
  checkoutSchema,
  updateCartSchema,
} from '../validation/cartValidation.js';
import { authenticate } from '../middlewares/authenticate.js';

const cartRouter = Router();

// Усі роути кошика приватні
cartRouter.use(authenticate);

cartRouter.get('/', getCart);
cartRouter.put('/update', celebrate(updateCartSchema), updateCart);
cartRouter.post('/checkout', celebrate(checkoutSchema), checkout);

export default cartRouter;
