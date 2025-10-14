// // backend/controllers/leavesController.js
// import Leave from "../models/leaveModel.js";

// // Submit a leave request
// export const submitLeave = async (req, res) => {
//   try {
//     const { employeeId, fromDate, toDate, daysApplied, leaveType, customTypes, reason } = req.body;
//     const file = req.file ? req.file.path : null;

//     const leave = new Leave({
//       employeeId,
//       fromDate,
//       toDate,
//       daysApplied,
//       leaveType,
//       customTypes,
//       reason,
//       file,
//     });

//     await leave.save();
//     res.status(201).json({ message: "Leave submitted successfully", leave });
//   } catch (error) {
//     res.status(500).json({ message: "Error submitting leave", error });
//   }
// };

// // Get leave history for an employee
// export const getLeaveHistory = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const leaves = await Leave.find({ employeeId }).sort({ createdAt: -1 });
//     res.status(200).json(leaves);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching leave history", error });
//   }
// };

// // Manager/HR approve leave
// export const approveLeave = async (req, res) => {
//   try {
//     const { leaveId } = req.params;
//     const leave = await Leave.findById(leaveId);
//     if (!leave) return res.status(404).json({ message: "Leave not found" });

//     leave.status = "Granted"; // or "Manager Approved" based on role
//     await leave.save();

//     res.status(200).json({ message: "Leave approved", leave });
//   } catch (error) {
//     res.status(500).json({ message: "Error approving leave", error });
//   }
// };
// controllers/leavesController.js
import Leave from "../models/leaveModel.js";

// Create a new leave request
export const createLeave = async (req, res) => {
  try {
    const { employeeName, fromDate, toDate, daysApplied, leaveType, reason } = req.body;
    const file = req.file ? req.file.filename : null;

    const leave = new Leave({
      employeeName,
      fromDate,
      toDate,
      daysApplied,
      leaveType,
      reason,
      file,
      status: "Sent"
    });

    const savedLeave = await leave.save();
    res.status(201).json(savedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leaves
export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve leave by ID
export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = "Approved";
    const updatedLeave = await leave.save();
    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
