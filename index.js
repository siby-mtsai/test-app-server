const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory "database"
let items = [
  { id: 1, name: "First item" },
  { id: 2, name: "Second item" },
];
let nextId = 3;

// GET /health - used by the ALB target group health check
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

// GET /api/items - list all items
app.get("/api/items", (req, res) => {
  res.json(items);
});

// POST /api/items - create a new item
app.post("/api/items", (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Field 'name' is required" });
  }

  const newItem = { id: nextId++, name: name.trim() };
  items.push(newItem);
  res.status(201).json(newItem);
});

// DELETE /api/items/:id - delete an item by id
app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  const [deleted] = items.splice(index, 1);
  res.json(deleted);
});

app.get("/", (req, res) => {
  res.send("Express API is running. Try GET /api/items");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
