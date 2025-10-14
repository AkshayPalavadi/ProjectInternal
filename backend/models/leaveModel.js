// // backend/models/leaveModel.js
// import mongoose from "mongoose";

// const leaveSchema = new mongoose.Schema({
//   employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
//   fromDate: { type: Date, required: true },
//   toDate: { type: Date, required: true },
//   daysApplied: { type: Number, required: true },
//   leaveType: { type: String, required: true },
//   customTypes: [String],
//   reason: { type: String },
//   file: { type: String }, // store file path
//   status: { type: String, default: "Sent" }, // Sent, Manager Approved, HR Approved, Granted, Rejected
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Leave", leaveSchema);
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    daysApplied: { type: Number, required: true },
    leaveType: { type: String, required: true },
    reason: { type: String },
    file: { type: String },
    status: { type: String, default: "Sent" }
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
