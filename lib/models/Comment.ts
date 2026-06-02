import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pageId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Comment =
  mongoose.models.Comment || mongoose.model('Comment', commentSchema);
export default Comment;
