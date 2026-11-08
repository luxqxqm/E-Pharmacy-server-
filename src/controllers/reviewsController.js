import { Review } from '../models/reviews.js';

export const getReviews = async (req, res) => {
  const viewers = await Review.find();
  res.status(200).json(viewers);
};
