import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Role', roleSchema);
