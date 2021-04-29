import { Request, Response } from 'express';

export class BaseController{
    public request!: Request
    protected response? : Response
}