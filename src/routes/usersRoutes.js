import { Router } from 'express';
import {
  getUserInfo,
  login,
  logout,
  refresh,
  register,
} from '../controllers/usersController.js';
import {
  loginUserSchema,
  refreshSchema,
  registerSchema,
} from '../validation/usersValidation.js';
import { celebrate } from 'celebrate';
import { authenticate } from '../middlewares/authenticate.js';

const userRouter = Router();

userRouter.post('/register', celebrate(registerSchema), register);
userRouter.post('/login', celebrate(loginUserSchema), login);
userRouter.get('/user-info', authenticate, getUserInfo);
userRouter.get('/logout', authenticate, logout);
userRouter.post('/refresh', celebrate(refreshSchema), refresh);

export default userRouter;
