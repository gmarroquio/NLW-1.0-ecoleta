import express from "express";

const app = express();

app.get("/users", (req, res) => {
  res.json({ users: ["joao", "pedro"] });
});

app.listen(3333);
