import { NextFunction, Request, Response } from "express";
import { IMiddleware } from "./Middleware";
export class AuthenticatedMiddleware implements IMiddleware {
    request!: Request;
    response!: Response;
    next!: NextFunction;

    fire() {
        if (this.request.session !== undefined && this.request.session!.user !== undefined) this.next();
        else {
            if (this.request.headers["x-requested-with"] === 'XMLHttpRequest') 
                this.response.status(401).send("UnAuthenticated User");
            else this.response.redirect("auth/login");
        }
    }
}
