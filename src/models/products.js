import { model, Schema } from 'mongoose';
import { CATEGORIES } from '../constants/categories.js';

const ProductSchema = new Schema(
  {
    photo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    suppliers: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Product = model('Product', ProductSchema);
