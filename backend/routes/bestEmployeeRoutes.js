import express from "express";
import {
  upload,
  addBestEmployee,
  getBestEmployees,
} from "../controllers/bestEmployeeController.js";

const router = express.Router();

router.post("/", upload.single("image"), addBestEmployee); // HR adds best employee
router.get("/", getBestEmployees); // Home page fetches list

export default router;
