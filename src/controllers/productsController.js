import createHttpError from 'http-errors';
import { Product } from '../models/products.js';

export const getProducts = async (req, res) => {
  const { name, category, page, perPage } = req.query;
  const filter = {};
  if (name) {
    filter.name = {
      $regex: name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      $options: 'i',
    };
  }
  if (category) {
    filter.category = category;
  }
  const skip = (page - 1) * perPage;
  const [totalItems, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).skip(skip).limit(perPage),
  ]);

  const totalPage = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPage,
    products,
  });
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }
  res.status(200).json(product);
};
