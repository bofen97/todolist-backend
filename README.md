# Todo API Service

基于 Express.js 和 MongoDB 实现的 RESTful API 服务，为 Todo 应用提供后端支持。

## 技术栈

- Node.js
- Express.js
- MongoDB (官方 Node.js 驱动)
- TypeScript

## run

```bash
.env
MONGODB_URI=mongodb+srv://<user>:<passwd>@xx.xx.mongodb.net/?retryWrites=true&w=majority&appName=xx
PORT=3001

npm install

npm run dev
```

## API 端点

### Todo 相关接口

```typescript
GET /api/todos         // 获取所有待办事项
POST /api/todos        // 创建新的待办事项
PUT /api/todos/:id     // 更新指定待办事项
DELETE /api/todos/:id  // 删除指定待办事项
GET /api/todos/:date   // 获取指定日期的待办事项
```

### 1. all todos

```
GET /api/todos

Response 200:
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "完成项目文档",
    "category": "工作",
    "priority": "high",
    "completed": false,
    "createdAt": "2024-01-16T10:00:00Z"
  }
]
```

### 2. create todo

```
POST /api/todos
Content-Type: application/json

Request Body:
{
  "title": "完成项目文档",
  "category": "工作",
  "priority": "high",    // "low" | "medium" | "high"
  "completed": false
}

Response 201:
{
  "id": "507f1f77bcf86cd799439011",
  "title": "完成项目文档",
  "category": "工作",
  "priority": "high",
  "completed": false,
  "createdAt": "2024-01-16T10:00:00Z"
}
```

### 3. update

```
PUT /api/todos/:id
Content-Type: application/json

Request Body:
{
  "title": "更新的标题",      // 可选
  "category": "个人",        // 可选
  "priority": "medium",     // 可选
  "completed": true         // 可选
}

Response 200:
{
  "message": "Todo updated successfully"
}

Response 404:
{
  "error": "Todo not found"
}
```

### 4. delete

```
DELETE /api/todos/:id

Response 200:
{
  "message": "Todo deleted successfully"
}

Response 404:
{
  "error": "Todo not found"
}
```

### interface

```typescript
interface Todo {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: Date;
}

interface CreateTodoBody {
  title: string;
  category: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

interface UpdateTodoBody {
  title?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
}
```
