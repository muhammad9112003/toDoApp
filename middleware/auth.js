// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token; // <-- مهم جداً، نفس الاسم اللي استخدمته في login
  if (!token) return res.redirect("/users/login");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.redirect("/users/login"); // invalid token → redirect
  }
};
