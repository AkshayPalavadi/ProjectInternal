const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  empName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Employee" },
  manager: { type: String, default: "Not Assigned" },
  awards: { type: [String], default: [] },
  appreciations: { type: [String], default: [] },
});

module.exports = mongoose.model("Employee", employeeSchema);
