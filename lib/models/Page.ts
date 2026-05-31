import mongoose, { Schema } from 'mongoose';

const pageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicUrl: {
      type: String,
      required: true,
    },
    categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    views: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      unique: false,
      required: false,
    },
  },
  { timestamps: true },
);

const Page = mongoose.models.Page || mongoose.model('Page', pageSchema);
export default Page;
