import { type IContext } from '@hellocacbantre/context';
import { BaseRouter } from './base.router';
export declare class AuthRouter extends BaseRouter {
    private readonly authCtl;
    private readonly authRole;
    constructor(context: IContext);
    protected configureRoutes(): void;
}
