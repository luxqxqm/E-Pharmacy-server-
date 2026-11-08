import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { CATEGORIES } from '../constants/categories.js';

export const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const productIdSchema = {
  [Segments.PARAMS]: Joi.object({
    productId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const getProductsSchema = {
  [Segments.QUERY]: Joi.object({
    name: Joi.string().trim(),
    category: Joi.string().valid(...CATEGORIES),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(50).default(12),
  }),
};
