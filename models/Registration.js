import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  employeeId: { type: Number, required: true },
  employeeName: { type: String, required: true },
  channelPartnerName: { type: String, required: true },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
  },
  whatsappNumber: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, "Invalid WhatsApp number"],
  },
  firmName: { type: String, required: true },
  officeLocation: { type: String, required: true },
  place: { type: String, required: true },
  eventDate: { type: String, default: "18 May 2026" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Registration ||
  mongoose.model("Registration", RegistrationSchema);
