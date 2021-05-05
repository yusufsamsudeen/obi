import { NextFunction, Request, Response } from 'express';


export interface IMiddleware{
    request : Request
    response : Response
    next : NextFunction
    fire() : void
}