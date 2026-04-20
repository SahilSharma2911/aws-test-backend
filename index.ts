import "dotenv/config";
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999.99, stock: 50 },
  { id: 2, name: "Phone", price: 499.99, stock: 120 },
  { id: 3, name: "Tablet", price: 299.99, stock: 75 },
];

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", app: process.env.APP_NAME, env: process.env.NODE_ENV });
});

app.get("/users", (req: Request, res: Response) => {
  res.json(users);
});

app.get("/users/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] as string);
  const user = users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

app.post("/users", (req: Request, res: Response) => {
  const { name, email } = req.body as { name?: string; email?: string };
  if (!name || !email) {
    res.status(400).json({ error: "name and email are required" });
    return;
  }
  const newUser: User = { id: users.length + 1, name, email };
  res.status(201).json({ ...newUser, message: "User created" });
});

app.get("/products", (req: Request, res: Response) => {
  res.json(products);
});

app.get("/products/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] as string);
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

app.get("/info", (req: Request, res: Response) => {
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
