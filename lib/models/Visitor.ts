import mongoose, { Schema } from 'mongoose';

const visitorSchema = new Schema(
  {
    country: {
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
