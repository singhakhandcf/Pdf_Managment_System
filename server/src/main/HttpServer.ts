import express, { Express, Request, Response } from "express";
import http from "http";
import path from 'path';
import cors from 'cors';
import connectToDatabase from "../config/db";
import { UserController } from "../controllers/UserController";

export class HttpServer {
  private app: Express;
  private port: number;
  private server: http.Server;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.configureMiddleware();
    this.configureRoutes();
    this.connectToDatabase();
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await connectToDatabase();
      console.log("Database connected successfully.");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
    }
  }

  // Middleware configuration
  private configureMiddleware(): void {
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "*"],
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

  }

  // Route configuration
  private configureRoutes(): void {
    const userController = new UserController();

    this.app.use("/user",userController.router);
  }

  // Start the HTTP server
  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}