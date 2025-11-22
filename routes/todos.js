const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

// Middleware to protect routes (JWT auth example)
const authMiddleware = require("../middleware/auth"); 


// All routes protected
router.use(authMiddleware);

router.get("/", todoController.getTodos);
router.post("/", todoController.addTodo);
router.post("/toggle/:id", todoController.toggleTodo);
router.post("/delete/:id", todoController.deleteTodo);

module.exports = router;
