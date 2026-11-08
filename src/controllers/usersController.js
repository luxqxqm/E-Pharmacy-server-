import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/users.js';
import { createSession } from '../services/auth.js';
import { Session } from '../models/session.js';

export const register = async (req, res) => {
  const { email, password } = req.body;
  const emailExist = await User.findOne({ email });

  if (emailExist) throw createHttpError(409, 'Email in use');
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword });

  res.status(201).json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw createHttpError(401, 'Invalid credentials');

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) throw createHttpError(401, 'Invalid credentials');

  await Session.deleteOne({ userId: user._id });
  const newSession = await createSession(user._id);

  res.status(200).json({
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
    user,
  });
};

export const getUserInfo = async (req, res) => {
  const { name, email } = req.user;
  res.status(200).json({ name, email });
};

export const logout = async (req, res) => {
  await Session.deleteOne({ userId: req.user._id });

  res.status(200).json({ message: 'Logout successful' });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  const session = await Session.findOne({ refreshToken });

  if (!session) throw createHttpError(401, 'Session not found');

  if (session.refreshTokenValidUntil < Date.now()) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });
  const newSession = await createSession(session.userId);

  res.status(200).json({
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
  });
};
