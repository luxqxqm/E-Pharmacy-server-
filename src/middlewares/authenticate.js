import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/users.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) throw createHttpError(401, 'Authorization header missing');

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    throw createHttpError(401, 'Invalid authorization header');
  }

  const session = await Session.findOne({ accessToken: token });

  if (!session) throw createHttpError(401, 'Session not found');

  if (session.accessTokenValidUntil < Date.now()) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = await User.findById(session.userId);

  if (!user) throw createHttpError(401, 'User not found');

  req.user = user;
  next();
};
