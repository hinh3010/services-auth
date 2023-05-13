import { Router } from 'express';
import { type IContext } from '@hellocacbantre/context';
export declare abstract class BaseRouter {
    protected readonly router: Router;
    protected readonly context: IContext;
    constructor(context: IContext);
    protected abstract configureRoutes(): void;
    getRouter(): Router;
}
