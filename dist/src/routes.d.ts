import { type IContext } from './@types/interfaces';
import { Router } from 'express';
export declare class AuthRouter {
    router: Router;
    readonly context: IContext;
    private readonly authCtl;
    private readonly authRole;
    constructor();
    routes(): void;
}
