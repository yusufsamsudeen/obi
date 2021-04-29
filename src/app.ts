import { Global } from './params/Global';
import  util  from 'util';
import { View } from './components/View';
import { ModelAndView } from './components/ModelAndView';
import { Methods, ResponseType } from './decorators/requestmethod.decorator';
import { AuthenticatedMiddleware } from "./middleware/AuthenticatedMiddleware";
import { ComponentTree } from "./params/ComponentTree";
import express, { Application, NextFunction, Request, Response, Router } from "express";
import session from "express-session";
import fs from "fs";
import path from "path";
import crayon from "crayon.js";

export class Volcry {
  private port: number;
  private app: Application;
  private baseScan: string;
  private router: Router = express.Router();

  constructor(port: number, baseScan: string) {
    this.port = port;
    this.app = express();
    this.baseScan = baseScan;
  }

  start(): Application {
    this.scanComponents(this.baseScan);
    this.app.set('view engine', 'pug')
    this.app.set('views', `${this.baseScan}/resources`)
    this.bootstrap();
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });

    return this.app
  }

  private bootstrap(): void {
    console.log(crayon.greenYellow("Bootstraping"));
    
    console.log(util.inspect(ComponentTree.components,  false, null, true))
    Object.entries<any>(ComponentTree.components).forEach(([index, item]) => {
     
      let base_url = item.base_url;
      Object.entries<any>(item.methods).forEach(([index_, element]) => {
        let url: string =
          base_url != null && base_url != undefined
            ? base_url + "/" + element.url
            : element.url;

        url = url.replace(/\/$/, "");

        switch(element.method){
          case Methods.GET :
              this.createGetRoute(item.constructor,element, url)
              break
          case Methods.POST :
              this.createPostRoute(item.constructor,element, url)
              break
                  
        }

      });
    });

    this.app.use(
      session({
        secret: "28392HKA!kdajajs**(229",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: true },
      })
    );
    this.app.use("/", this.router);
    console.log("Done Bootstraping");
  }

  public getApp() :Application {
    return this.app
  }

  private serveRequest(constructor: Function, controller_action : any, request : Request, response : Response) : void{
    let parameter_count = controller_action.parameter_count;
    let return_value = null;
    var action_controller = Reflect.construct(constructor, [])
    
    Reflect.set(action_controller, 'request', request)
    

    if (parameter_count > 0) {
            let params = controller_action.params;
            let paramList: any = [];
            params.sort((a : any,b : any) => (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0))

            params.forEach((object: any, i: any) => {
              if (request.query[object.name] !== undefined){
                  paramList.push(request.query[object.name])
              }
            });
            
            
            return_value = controller_action.action.apply(action_controller,paramList)
    } else {
            return_value = action_controller[controller_action.name]()
    }
          request = Reflect.get(action_controller, "request")
         console.log("Session")
          console.log(request.session)
          this.handleResponse(return_value, response, controller_action)
  }

  private handleResponse(return_value : any, response : Response, controller_action : any){
    if(controller_action.response_type == ResponseType.JSON && return_value !==undefined){
        response.json(return_value)
        return
    }
    if(return_value instanceof ModelAndView){
      const view = View.findView(return_value.getTemplateName())
      response.render(view, return_value.getAttributes())
      return
    }
    if(typeof return_value === "string"){
      if(return_value.startsWith(":")){
        let redirect_route = return_value.substr(1)
        response.redirect(redirect_route)
        return
      }
      const view = View.findView(return_value.toString())
      response.render(view)
      return
    }
    if(return_value==undefined){
      response.end()
      return
    }
    response.send(return_value)
  }

  private scanComponents(baseRoute: string) {
    baseRoute = path.resolve(baseRoute);
    let files = fs.readdirSync(baseRoute);
    for (let file of files) {
      let br = path.join(path.resolve(baseRoute), "/", file);
      let stat = fs.statSync(path.resolve(br));
      if (stat.isFile() && file.toLowerCase().indexOf("controller") > -1) {
        console.log(`Controller ${br}`);
        require(br);
      }
      if (stat.isDirectory()) {
        this.scanComponents(path.join(baseRoute,"/", file));
      }
    }
  }

  private authenticated(authenticated : boolean, request : Request, response : Response, next : NextFunction){
    if (authenticated) {
      new AuthenticatedMiddleware(request, response, next);
    }else{
      next()
    }
  }

  private createGetRoute(constructor : Function,properties : any, url:string){
    this.router.get(`/${url}`, (request, response, next) => {
      this.authenticated(properties.authenticated, request, response, next)
    },(request, response, next) =>{          
        this.serveRequest(constructor,properties, request, response)
    })
  }

  private createPostRoute(constructor : Function,properties : any, url:string){
    this.router.post(`/${url}`, (request, response, next) => {
    this.authenticated(properties.authenticated, request, response, next)
    },(request, response, next) =>{          
        this.serveRequest(constructor,properties, request, response)
    })
  }

  private createPutRoute(constructor : Function,properties : any, url:string){
    this.router.put(`/${url}`, (request, response, next) => {
      this.authenticated(properties.authenticated, request, response, next)
    },(request, response, next) =>{          
        this.serveRequest(constructor, properties, request, response)
    })
  }
  
}
