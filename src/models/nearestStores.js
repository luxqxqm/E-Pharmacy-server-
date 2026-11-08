import { model, Schema } from 'mongoose';

const NearestStoreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

export const NearestStore = model('NearestStore', NearestStoreSchema);
