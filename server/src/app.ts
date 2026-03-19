import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/env.js";
import { rateLimiter } from "./middlewares/rate-limit-middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { departmentRouter } from "./routes/department.routes.js";
import { studentRouter } from "./routes/student.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { subjectRouter } from "./routes/subject.routes.js";
import { resultRouter } from "./routes/result.routes.js";
import { companyRouter } from "./routes/company.routes.js";
import { attendanceRouter } from "./routes/attendance.routes.js";
import { documentRouter } from "./routes/document.routes.js";
import { chatbotRouter } from "./routes/chatbot.routes.js";
import { voiceRouter } from "./routes/voice.routes.js";

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

app.get("/health-check", (_req, res) => {
  res.status(200).json({ status: 200, message: "Server is Healthy... 😇😇" });
});

app.get("/", (_req, res) => {
  res.status(200).json({ status: 200, message: "Server up n running... ✅✅" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/subject", subjectRouter);
app.use("/api/v1/result", resultRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/document", documentRouter);
app.use("/api/v1/chat", chatbotRouter);
app.use("/api/v1/voice", voiceRouter); // ← voice STT → agent → TTS

export default app;
