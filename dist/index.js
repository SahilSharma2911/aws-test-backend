"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
];
const products = [
    { id: 1, name: "Laptop", price: 999.99, stock: 50 },
    { id: 2, name: "Phone", price: 499.99, stock: 120 },
    { id: 3, name: "Tablet", price: 299.99, stock: 75 },
];
app.get("/health", (req, res) => {
    res.json({ status: "ok", app: process.env.APP_NAME, env: process.env.NODE_ENV });
});
app.get("/users", (req, res) => {
    res.json(users);
});
app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params["id"]);
    const user = users.find((u) => u.id === id);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json(user);
});
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ error: "name and email are required" });
        return;
    }
    const newUser = { id: users.length + 1, name, email };
    res.status(201).json({ ...newUser, message: "User created" });
});
app.get("/products", (req, res) => {
    res.json(products);
});
app.get("/products/:id", (req, res) => {
    const id = parseInt(req.params["id"]);
    const product = products.find((p) => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    res.json(product);
});
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
