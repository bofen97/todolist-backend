// src/routes/todos.ts
import { Router, RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/db";
import { Todo } from "../types/todo";
import { ParamsDictionary } from "express-serve-static-core";

const router = Router();

// 接口定义
interface TodoParams extends ParamsDictionary {
  id: string;
}

interface DateParams extends ParamsDictionary {
  date: string;
}

interface CreateTodoBody {
  title: string;
  category: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  userId: string; // 添加 userId
}

interface UpdateTodoBody {
  title?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  userId: string; // 添加 userId
}

// Get all todos
const getUserTodos: RequestHandler = async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const userId = req.params.userId;
    const todos = await db.collection("todos").find({ userId }).toArray();
    res.json(
      todos.map((todo) => ({
        ...todo,
        id: todo._id.toString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

// Create todo
const createTodo: RequestHandler<{}, {}, CreateTodoBody> = async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const todo = {
      ...req.body,
      createdAt: new Date(),
    };
    if (!todo.userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    const result = await db.collection("todos").insertOne(todo);
    res.status(201).json({
      ...todo,
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
};

// Update todo
const updateTodo: RequestHandler<TodoParams, {}, UpdateTodoBody> = async (
  req,
  res,
  next
) => {
  try {
    const { db } = await connectToDatabase();
    const { id } = req.params;

    const { userId } = req.body;
    const existingTodo = await db.collection("todos").findOne({
      _id: new ObjectId(id),
    });

    if (!existingTodo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    if (existingTodo.userId !== userId) {
      res.status(403).json({ error: "Unauthorized access" });
      return;
    }

    const result = await db
      .collection("todos")
      .updateOne({ _id: new ObjectId(id), userId }, { $set: req.body });

    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

// Delete todo
const deleteTodo: RequestHandler<TodoParams> = async (req, res, next) => {
  try {
    const { db } = await connectToDatabase();
    const { id } = req.params;
    const { userId } = req.body;

    // 验证权限
    const existingTodo = await db.collection("todos").findOne({
      _id: new ObjectId(id),
    });

    if (!existingTodo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    if (existingTodo.userId !== userId) {
      res.status(403).json({ error: "Unauthorized access" });
      return;
    }

    const result = await db.collection("todos").deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};

// Get todos by date
const getTodosByDate: RequestHandler<DateParams> = async (req, res, next) => {
  try {
    const { db } = await connectToDatabase();
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    const todos = await db
      .collection("todos")
      .find({
        userId,
        createdAt: {
          $gte: date,
          $lt: nextDay,
        },
      })
      .toArray();

    res.json(
      todos.map((todo) => ({
        ...todo,
        id: todo._id.toString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching todos by date:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

// 路由注册
// 路由注册
router.get("/user/:userId", getUserTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);
router.get("/date/:date", getTodosByDate);
export default router;
