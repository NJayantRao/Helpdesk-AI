import app from "./app.js";
import { ENV } from "./lib/env.js";
import { startWorkerServer } from "./services/worker.js";

const port = ENV.PORT || 5000;

startWorkerServer();

app.listen(port, () => {
  console.log(`🚀🚀 Server running successfully on port ${port}... `);
});
