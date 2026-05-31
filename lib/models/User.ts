import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      trim: true,
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.models.users || mongoose.model('users', userSchema);
export default User;
