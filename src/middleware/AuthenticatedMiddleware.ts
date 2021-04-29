import { NextFunction, Request, Response } from 'express';
export class AuthenticatedMiddleware {

    private request:Request
    private response:Response
    private next:NextFunction

    constructor(request:Request, response:Response, next:NextFunction){
        this.request = request
        this.response = response
        this.next = next
        this.validate()
    }

    private validate():void  {
        if(this.request.session !== undefined && this.request.session!.user !==undefined)
            this.next()
        else    
            this.response.status(401).send("UnAuthenticated User")    
    }
}