import { Joi, Segments } from 'celebrate';

export const phoneRegex = /^\+380\d{9}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export const registerSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(2).max(32).required(),
    email: Joi.string().email().lowercase().required(),
    phone: Joi.string().pattern(phoneRegex).required().messages({
      'string.pattern.base': 'Phone must be in format +380XXXXXXXXX',
    }),
    password: Joi.string().min(8).pattern(passwordRegex).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base':
        'Password must contain at least one letter, one number and one special character',
    }),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }),
};

export const refreshSchema = {
  [Segments.BODY]: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};
