import { type IContext } from '@hellocacbantre/context';
import express from 'express';
export declare const serverLoader: (context: IContext) => (app: express.Application) => Promise<void>;
