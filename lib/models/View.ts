import mongoose, { Schema } from 'mongoose';

const viewtSchema = new Schema(
  {
    visitorId: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page',
      required: true,
    },
  },
  { timestamps: true },
);

const View = mongoose.models.View || mongoose.model('View', viewtSchema);
export default View;
