import express from "express";

export function createApp() {
  const app = express();
  app.use(express.json());

  return app;
}

if (process.env.NODE_ENV !== "test") {
  const app = createApp();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
