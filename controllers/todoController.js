const Todo = require("../modules/todo");

// Get all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId });
    res.json(todos); // بدل res.render
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load todos" });
  }
};

// Add new todo
exports.addTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todo = new Todo({ title, user: req.userId });
    await todo.save();
    res.status(201).json(todo); // بدل res.redirect
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add todo" });
  }
};

// Toggle complete
exports.toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo); // بدل res.redirect
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle todo" });
  }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" }); // بدل res.redirect
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete todo" });
  }
};
