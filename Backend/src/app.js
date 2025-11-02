import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS setup — supports multiple origins and Postman testing
const allowedOrigins = [
  process.env.CORS_ORIGIN,       // e.g. http://localhost:5173
  "http://localhost:3000",       // React dev server (optional)
  "http://127.0.0.1:5173",       // sometimes needed for Vite
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Body parsers and static files
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Routes
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

export { app };
