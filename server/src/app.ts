import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/env.js";
import { rateLimiter } from "./middlewares/rate-limit-middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { departmentRouter } from "./routes/department.routes.js";
import { studentRouter } from "./routes/student.routes.js";
import { adminRouter } from "./routes/admin.routes.js";

const app = express();

app.use(
  cors({
    origin: [ENV.FRONTEND_LOCAL_URL, ENV.FRONTEND_PROD_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/.*/, cors());

app.use(express.json());

app.use(cookieParser());

app.set("trust proxy", 1);

app.use(rateLimiter);

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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/department", departmentRouter);

export default app;
