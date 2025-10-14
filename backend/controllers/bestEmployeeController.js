import BestEmployee from "../models/BestEmployee.js";
import multer from "multer";
import path from "path";

// 🧩 Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

// 🧩 Add new Best Employee
export const addBestEmployee = async (req, res) => {
  try {
    const { name, position, month } = req.body;
    const image = req.file ? req.file.filename : null;

    const bestEmployee = await BestEmployee.create({
      name,
      position,
      month,
      image,
    });

    res.status(201).json(bestEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧩 Get all Best Employees (for Home Page)
export const getBestEmployees = async (req, res) => {
  try {
    const employees = await BestEmployee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
