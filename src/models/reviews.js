import { model, Schema } from 'mongoose';

const ReviewSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    testimonial: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Review = model('Review', ReviewSchema);
