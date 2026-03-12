import express from "express";

const app = express();

/**
 * @route GET /health-check
 * @description Health check endpoint to verify if the server is running and healthy.
 * @access public
 */
app.get("/health-check", (req, res) => {
  res.status(200).json({ status: 200, message: "Server is Healthy... 😇😇" });
});

/**
 * @route GET /
 * @description Root endpoint for the API.
 * @access public
 */
app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "Server up n running... ✅✅" });
});

export default app;
