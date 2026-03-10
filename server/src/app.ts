import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "Server up n running... ✅✅" });
});

app.get("/health-check", (req, res) => {
  res.status(200).json({ status: 200, message: "Server is healthy... ✅✅" });
});

export default app;
