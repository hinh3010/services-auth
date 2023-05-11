import { Router } from 'express';
import { type IContext } from '@hellocacbantre/context';
export declare class AuthRouter {
    router: Router;
    readonly context: IContext;
    private readonly authCtl;
    private readonly authRole;
    constructor();
    routes(): void;
}
