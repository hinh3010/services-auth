/// <reference types="qs" />
import { type Request, type Response } from 'express';
import { type IContext } from '../@types';
export declare class AuthController {
    private readonly authAction;
    private readonly context;
    private readonly falcol;
    constructor(context: IContext);
    signUp: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: import("express").NextFunction) => void;
    signIn: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: import("express").NextFunction) => void;
}
