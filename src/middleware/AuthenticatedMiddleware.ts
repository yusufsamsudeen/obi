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
        console.log("Validating cookie")
        if(this.request.session.hasOwnProperty("user"))
            this.next()
        else    
            this.response.status(403).send("UnAuthenticated User")    
    }
}