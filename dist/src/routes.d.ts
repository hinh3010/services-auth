import { Router } from 'express';
import { type IContext } from '@hellocacbantre/context';
export declare class AuthRouter {
    router: Router;
    private readonly context;
    private readonly authCtl;
    private readonly authRole;
    constructor(context: IContext);
    routes(): void;
}
