const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const router = express.Router();


// 📝 Register Employee
router.post("/register", async (req, res) => {
  try {
    const { empId, empName, email, password, confirmPassword } = req.body;

    // Validate input
    if (!empId || !empName || !email || !password || !confirmPassword)
      return res.status(400).json({ msg: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ msg: "Passwords do not match" });

    // ✅ Check dhatvibs.com domain
    const domain = email.split("@")[1];
    if (domain !== "dhatvibs.com")
      return res.status(400).json({ msg: "Only dhatvibs.com emails are allowed" });

    // ✅ Strong password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
      });
    }

    const existingEmp = await Employee.findOne({ email });
    if (existingEmp) return res.status(400).json({ msg: "Email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmp = new Employee({
      empId,
      empName,
      email,
      password: hashedPassword,
    });

    await newEmp.save();
    res.status(201).json({ msg: "Employee registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// 🔑 Login Employee
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: employee._id, empName: employee.empName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// 📋 GET All Employees (Protected route)
router.get("/employees", async (req, res) => {
  try {
const employees = await Employee.find().select("empId empName email");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// 📋 Optional: GET Single Employee by ID
// GET Single Employee by empId (custom ID)
router.get("/employees/:empId", async (req, res) => {
  try {
    const employee = await Employee.findOne({ empId: req.params.empId }).select("-password");
    if (!employee) return res.status(404).json({ msg: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


module.exports = router;
