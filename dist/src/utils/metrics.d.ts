import { type Application } from 'express';
import client from 'prom-client';
export declare const restResponseTimeHistogram: client.Histogram<"route" | "method" | "status_code">;
export declare const databaseResponseTimeHistogram: client.Histogram<"operation" | "success">;
export declare function startMetricsServer(app: Application, port: number): void;
