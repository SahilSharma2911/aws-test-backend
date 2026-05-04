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

interface Order {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
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

const orders: Order[] = [
  { id: 1, userId: 1, productId: 2, quantity: 2, totalPrice: 999.98, status: "confirmed", createdAt: "2026-04-28T10:15:00.000Z" },
  { id: 2, userId: 2, productId: 1, quantity: 1, totalPrice: 999.99, status: "confirmed", createdAt: "2026-04-29T14:30:00.000Z" },
  { id: 3, userId: 3, productId: 3, quantity: 3, totalPrice: 899.97, status: "pending",   createdAt: "2026-04-30T09:00:00.000Z" },
  { id: 4, userId: 1, productId: 3, quantity: 1, totalPrice: 299.99, status: "cancelled", createdAt: "2026-05-01T11:45:00.000Z" },
  { id: 5, userId: 2, productId: 2, quantity: 1, totalPrice: 499.99, status: "confirmed", createdAt: "2026-05-02T16:20:00.000Z" },
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

app.get("/orders", (req: Request, res: Response) => {
  res.json(orders);
});

app.get("/orders/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] as string);
  const order = orders.find((o) => o.id === id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

app.post("/orders", (req: Request, res: Response) => {
  const { userId, productId, quantity } = req.body as {
    userId?: number;
    productId?: number;
    quantity?: number;
  };

  if (!userId || !productId || !quantity) {
    res.status(400).json({ error: "userId, productId, and quantity are required" });
    return;
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const product = products.find((p) => p.id === productId);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  if (quantity < 1) {
    res.status(400).json({ error: "quantity must be at least 1" });
    return;
  }

  if (product.stock < quantity) {
    res.status(400).json({ error: `Insufficient stock. Available: ${product.stock}` });
    return;
  }

  product.stock -= quantity;

  const newOrder: Order = {
    id: orders.length + 1,
    userId,
    productId,
    quantity,
    totalPrice: parseFloat((product.price * quantity).toFixed(2)),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.delete("/orders/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] as string);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (order.status === "cancelled") {
    res.status(400).json({ error: "Order is already cancelled" });
    return;
  }

  const product = products.find((p) => p.id === order.productId);
  if (product) {
    product.stock += order.quantity;
  }

  order.status = "cancelled";
  res.json({ message: "Order cancelled", order });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
