import express from "express";
import { z } from "zod";
import { randomUUID } from "crypto";

interface User {
  id: string;
  name: string;
  email: string;
}

const users: Map<string, User> = new Map();


const userCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export function createApp() {
  const app = express();
  app.use(express.json());

  // Ensure isolated state per app instance in tests
  users.clear();

  // Create
  app.post("/users", (req, res) => {
    const parse = userCreateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const id = randomUUID();
    const user: User = { id, ...parse.data };
    users.set(id, user);
    res.status(201).json(user);
  });

  // Read all
  app.get("/users", (_req, res) => {
    res.json(Array.from(users.values()));
  });

  // Read one
  app.get("/users/:id", (req, res) => {
    const user = users.get(req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  });

  // Update
  app.put("/users/:id", (req, res) => {
    const user = users.get(req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    const parse = userUpdateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    const updated: User = { ...user, ...parse.data } as User;
    users.set(user.id, updated);
    res.json(updated);
  });

  // Delete
  app.delete("/users/:id", (req, res) => {
    const existed = users.delete(req.params.id);
    if (!existed) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  });

  return app;
}

if (process.env.NODE_ENV !== "test") {
  const app = createApp();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}