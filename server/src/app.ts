import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server up n running... ✅✅");
});

export default app;
