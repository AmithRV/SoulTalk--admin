import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page',
      required: true,
    },
  },
  { timestamps: true },
);

const Comment =
  mongoose.models.Comment || mongoose.model('Comment', commentSchema);
export default Comment;
