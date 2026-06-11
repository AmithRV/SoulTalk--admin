import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      unique: false,
      required: false,
    },
  },
  { timestamps: true },
);

const Category =
  mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
