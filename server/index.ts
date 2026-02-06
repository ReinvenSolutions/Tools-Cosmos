import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";

const app = express();

// Trust proxy - needed for secure cookies behind Railway/reverse proxy
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Disable x-powered-by header for security and reduce overhead
app.disable('x-powered-by');

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

// Configure session middleware with memory optimization
app.use(session({
  secret: process.env.SESSION_SECRET || 'contador-dias-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false, // Don't create sessions until something is stored
  rolling: false, // Only update session when data changes
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // Reduced to 7 days to save memory
    sameSite: 'lax',
  },
  // Cleanup expired sessions periodically to reduce memory usage
  name: 'sid', // Shorter session name
}));

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Setup authentication
setupAuth(app);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  // Configure HTTP server timeouts for better resource management
  server.keepAliveTimeout = 65000; // Slightly higher than load balancer (Railway uses 60s)
  server.headersTimeout = 66000; // Slightly higher than keepAliveTimeout
  server.requestTimeout = 30000; // 30 seconds for individual requests
  
  // Set max connections to prevent resource exhaustion
  server.maxConnections = 1000;
  
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });

  // Graceful shutdown handler
  const gracefulShutdown = (signal: string) => {
    log(`${signal} signal received: closing HTTP server`);
    server.close(() => {
      log('HTTP server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      log('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught errors gracefully
  process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  process.on('unhandledRejection', (reason) => {
    log(`Unhandled Rejection: ${reason}`);
    gracefulShutdown('UNHANDLED_REJECTION');
  });
})();
