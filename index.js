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

// GET /items - list all items
app.get("/items", (req, res) => {
  res.json(items);
});

// POST /items - create a new item
app.post("/items", (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Field 'name' is required" });
  }

  const newItem = { id: nextId++, name: name.trim() };
  items.push(newItem);
  res.status(201).json(newItem);
});

// DELETE /items/:id - delete an item by id
app.delete("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  const [deleted] = items.splice(index, 1);
  res.json(deleted);
});

app.get("/", (req, res) => {
  res.send("Express API is running. Try GET /items");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
