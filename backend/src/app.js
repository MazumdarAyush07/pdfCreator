import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "100mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());
//Routes
import userRouter from "./routes/user.routes.js";
import fileRouter from "./routes/files.routes.js";
//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/file", fileRouter);
export { app };
