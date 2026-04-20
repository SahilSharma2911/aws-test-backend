require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: process.env.APP_NAME, env: process.env.NODE_ENV });
});

// Users routes
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
  ]);
});

app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 1 || id > 3) {
    return res.status(404).json({ error: "User not found" });
  }
  const users = ["Alice", "Bob", "Charlie"];
  res.json({ id, name: users[id - 1], email: `${users[id - 1].toLowerCase()}@example.com` });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  res.status(201).json({ id: 4, name, email, message: "User created" });
});

// Products routes
app.get("/products", (req, res) => {
  res.json([
    { id: 1, name: "Laptop", price: 999.99, stock: 50 },
    { id: 2, name: "Phone", price: 499.99, stock: 120 },
    { id: 3, name: "Tablet", price: 299.99, stock: 75 },
  ]);
});

app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const products = [
    { id: 1, name: "Laptop", price: 999.99, stock: 50 },
    { id: 2, name: "Phone", price: 499.99, stock: 120 },
    { id: 3, name: "Tablet", price: 299.99, stock: 75 },
  ];
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Config info (safe to expose in dev, not in prod)
app.get("/info", (req, res) => {
  res.json({
    app: process.env.APP_NAME,
    env: process.env.NODE_ENV,
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
