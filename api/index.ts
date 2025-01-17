// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import todosRouter from "../src/routes/todos";

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    // 允许的前端域名，替换成你的Vercel前端应用域名
    "https://todo-app-taupe-chi-60.vercel.app",
    // 开发环境域名
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // 如果需要携带cookies
};

// 使用配置的CORS中间件
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/todos", todosRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Remove the app.listen() call since Vercel handles this
export default app;
