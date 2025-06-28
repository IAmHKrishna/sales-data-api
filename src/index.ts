import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./utils/data-source";
import { router } from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", router);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

AppDataSource.initialize()
  .then(() => {
    console.log("DB Connected Successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error in db connection:", err);
    process.exit(1); 
  });