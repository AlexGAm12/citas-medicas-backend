import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },

    specialty: { type: mongoose.Schema.Types.ObjectId, ref: "Specialty", default: null },

    date: { type: Date, required: true, index: true },


    startTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    endTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },

    reason: { type: String, default: "" },
    notes: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada", "finalizada"],
      default: "pendiente",
      index: true,
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, date: 1, startTime: 1, endTime: 1 });

export default mongoose.model("Appointment", appointmentSchema);
