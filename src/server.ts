
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cluster from 'node:cluster';
import os from 'node:os';
import { config } from './config/config.js';

const app = express();

const totalCPUs = os.availableParallelism();
const workersToFork = Math.max(1, totalCPUs - 1);

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(
    `Total CPUs: ${totalCPUs} → Forking ${workersToFork} workers (1 CPU reserved for primary)`
  );

  // Fork workers
  for (let i = 0; i < workersToFork; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log(`Worker ${worker.process.pid} started`);
  });

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (code: ${code || signal})`);
    console.log('Restarting a new worker...');
    cluster.fork(); // Zero-downtime restart
  });
} else {
  app.use(
    express.json({
      verify: (req: Request & { rawBody?: string }, _res: Response, buf: Buffer) => {
        req.rawBody = buf.toString();
      },
    })
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: '*', 
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
      ],
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );

  app.use(cookieParser());

  // Test route
  app.get('/', (_req: Request, res: Response) => {
    console.log('Hey I am Nodejs Container V5');
    return res.json({ message: 'Hey I am Node Js Container V5' });
  });

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  // 404 handler
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new Error('That endpoint does not exist!'));
  });

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.message || err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });
  process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
  });


  app.listen(config.get('PORT'), () => {
    console.log(
      `Server running on the:${config.get('PORT')}`
    );
  });
}