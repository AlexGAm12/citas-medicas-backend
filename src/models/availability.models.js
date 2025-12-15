import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },

    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
      default: 0,
    },

    startTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    endTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },

    slotDuration: { type: Number, required: true, min: 5, default: 30 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// evita duplicados exactos por doctor+fecha+horario
availabilitySchema.index(
  { doctor: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

export default mongoose.model("Availability", availabilitySchema);
