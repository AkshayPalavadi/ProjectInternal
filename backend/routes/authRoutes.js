const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const router = express.Router();

/**
 * 📝 Register Employee
 */
router.post("/register", async (req, res) => {
  try {
    const {
      
      firstName,
      lastName,
      email,
      dateOfBirth,
      phoneNumber,
      password,
      confirmPassword,
    } = req.body;

    // ✅ Validate required fields
    if (
      //!empId ||
      !firstName ||
      !lastName ||
      !email ||
      !dateOfBirth ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ✅ Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // ✅ Email domain validation (only dhatvibs.com allowed)
    const domain = email.split("@")[1];
    if (domain !== "dhatvibs.com") {
      return res
        .status(400)
        .json({ msg: "Only dhatvibs.com emails are allowed" });
    }

    // ✅ Strong password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must include uppercase, lowercase, number, and special character.",
      });
    }

    // ✅ Check existing employee
    const existingEmp = await Employee.findOne({ email });
    if (existingEmp) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create new employee
    const newEmp = new Employee({
      //empId,
      firstName,
      lastName,
      email,
      dateOfBirth,
      phoneNumber,
      password: hashedPassword,
    });

    await newEmp.save();
    res.status(201).json({ msg: "Employee registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: err.message });
  }
});

/**
 * 🔑 Login Employee
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: employee._id, firstName: employee.firstName, empId: employee.empId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * 📋 Get all employees
 */
router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find().select(
      "empId firstName lastName email dateOfBirth phoneNumber"
    );
    res.json(employees);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/**
 * 📋 Get single employee by empId
 */
router.get("/employees/:empId", async (req, res) => {
  try {
    const employee = await Employee.findOne({
      empId: req.params.empId,
    }).select("-password");
    if (!employee)
      return res.status(404).json({ msg: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
