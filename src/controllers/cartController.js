import createHttpError from 'http-errors';
import { Cart } from '../models/cart.js';
import { Order } from '../models/orders.js';
import { Product } from '../models/products.js';

// Рахуємо суму кошика, товари без продукту (видалені) пропускаємо
const calcTotalPrice = (items) => {
  const total = items.reduce(
    (sum, { productId, quantity }) =>
      productId ? sum + productId.price * quantity : sum,
    0,
  );
  return Math.round(total * 100) / 100;
};

const getCartData = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('products.productId');

  if (!cart) return { products: [], totalPrice: 0 };

  return { products: cart.products, totalPrice: calcTotalPrice(cart.products) };
};

export const getCart = async (req, res) => {
  const cartData = await getCartData(req.user._id);
  res.status(200).json(cartData);
};

export const updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);

  if (!product) throw createHttpError(404, 'Product not found');

  if (quantity > product.stock) {
    throw createHttpError(400, `Only ${product.stock} items in stock`);
  }

  const cart = (await Cart.findOne({ userId })) ?? new Cart({ userId });
  const item = cart.products.find((p) => p.productId.equals(productId));

  // quantity 0 — прибираємо товар з кошика
  if (quantity === 0) {
    cart.products = cart.products.filter((p) => !p.productId.equals(productId));
  } else if (item) {
    item.quantity = quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  await cart.save();

  const cartData = await getCartData(userId);
  res.status(200).json(cartData);
};

export const checkout = async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId }).populate('products.productId');

  if (!cart || cart.products.length === 0) {
    throw createHttpError(400, 'Cart is empty');
  }

  for (const { productId: product, quantity } of cart.products) {
    if (!product) throw createHttpError(400, 'Some products are unavailable');

    if (quantity > product.stock) {
      throw createHttpError(400, `Not enough stock for ${product.name}`);
    }
  }

  const products = cart.products.map(({ productId: product, quantity }) => ({
    productId: product._id,
    quantity,
    price: product.price,
  }));

  const order = await Order.create({
    ...req.body,
    userId,
    products,
    totalPrice: calcTotalPrice(cart.products),
  });

  // Списуємо куплену кількість зі складу
  await Product.bulkWrite(
    products.map(({ productId, quantity }) => ({
      updateOne: {
        filter: { _id: productId },
        update: { $inc: { stock: -quantity } },
      },
    })),
  );

  cart.products = [];
  await cart.save();

  res.status(201).json(order);
};
