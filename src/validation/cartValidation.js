import { Joi, Segments } from 'celebrate';
import { objectIdValidator } from './productsValidation.js';
import { phoneRegex } from './usersValidation.js';

export const updateCartSchema = {
  [Segments.BODY]: Joi.object({
    productId: Joi.string().custom(objectIdValidator).required(),
    quantity: Joi.number().integer().min(0).required(),
  }),
};

export const checkoutSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(2).max(32).required(),
    email: Joi.string().email().lowercase().required(),
    phone: Joi.string().pattern(phoneRegex).required().messages({
      'string.pattern.base': 'Phone must be in format +380XXXXXXXXX',
    }),
    address: Joi.string().trim().min(5).max(128).required(),
    paymentMethod: Joi.string().valid('Cash', 'Bank').default('Cash'),
  }),
};
