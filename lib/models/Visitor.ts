import mongoose, { Schema } from 'mongoose';

const visitorSchema = new Schema(
  {
    visitorId: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    totalVisits: {
      type: String,
      required: false,
    },
    device: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const Visitor =
  mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
export default Visitor;
