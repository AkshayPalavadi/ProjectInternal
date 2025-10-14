// // backend/routes/leavesRoutes.js
// import express from "express";
// import multer from "multer";
// import { submitLeave, getLeaveHistory, approveLeave } from "../controllers/leavesController.js";

// const router = express.Router();

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
// });
// const upload = multer({ storage });

// // Submit leave
// router.post("/", upload.single("file"), submitLeave);

// // Get leave history
// router.get("/:employeeId", getLeaveHistory);

// // Approve leave
// router.patch("/approve/:leaveId", approveLeave);

// export default router;
// routes/leavesRoutes.js
import express from "express";
import { createLeave, getLeaves, approveLeave } from "../controllers/leavesController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getLeaves);
router.post("/", upload.single("file"), createLeave);
router.put("/:id/approve", approveLeave);

export default router;

