const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../modules/users");

// Handle registration
exports.registerUser = async (req, res) => {
  try {
    const { Fname, Lname, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      Fname,
      Lname,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // رجع JSON بدل redirect
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// Handle login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

// Handle logout
exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
