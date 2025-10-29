const authMiddleware = require("../middleware/authMiddleware");

// 🧾 Dashboard (Protected Route)
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const employee = req.employee;

    res.json({
      empId: employee.empId,
      empName: employee.empName,
      email: employee.email,
      role: employee.role,
      manager: employee.manager,
      awards: employee.awards,
      appreciations: employee.appreciations,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
