import { IMiddleware } from '../../../src/middleware/Middleware';
import { NextFunction, Request, Response } from "express";

export class TestMiddleware implements IMiddleware{
    request!: Request;
    response!: Response;
    next!: NextFunction;

    fire() {
        console.log(` Request is json ${this.request.is('application/json')}`)
    }
}