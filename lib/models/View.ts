import mongoose, { Schema } from 'mongoose';

const viewtSchema = new Schema(
  {
    visitorId: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page',
      required: false,
    },
  },
  { timestamps: true },
);

const View = mongoose.models.View || mongoose.model('View', viewtSchema);
export default View;
