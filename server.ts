import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import cartRoutes from "@infrastructure/routes/cartRoutes";
import componentRoutes from "@infrastructure/routes/componentRoutes";
import blogRoutes from "@infrastructure/routes/blogRoutes";

const app = express();
const port = process.env.PORT || 4001;

const corsOptions = {
  // origin: "https://spark-admin-production.up.railway.app",
  credentials: true,
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Component routes
app.use("/api/components", componentRoutes);

// Cart routes
app.use("/api/carts", cartRoutes);

// Blog routes
app.use("/api/blog", blogRoutes);

// Default route to handle unknown endpoints
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error occurred: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
