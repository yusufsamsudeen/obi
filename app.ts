import { View } from './components/View';
import { ModelAndView } from './components/ModelAndView';
import { Methods } from './decorators/requestmethod.decorator';
import { AuthenticatedMiddleware } from "./middleware/AuthenticatedMiddleware";
import { ComponentTree } from "./params/ComponentTree";
import express, { NextFunction, Request, Response, Router } from "express";
import session from "express-session";
import fs from "fs";
import path from "path";
import crayon from "crayon.js";

export class App {
  private port: number;
  private app: any;
  private baseScan: string;
  private router: Router = express.Router();

  constructor(port: number, baseScan: string) {
    this.port = port;
    this.app = express();
    this.baseScan = baseScan;
  }

  start(): void {
    this.scanComponents(this.baseScan);
    this.app.set('view engine', 'pug')
    this.app.set('views', 'resources')
    this.bootstrap();
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }

  private bootstrap(): void {
    console.log(crayon.greenYellow("Bootstraping"));
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
              this.createGetRoute(element, url)
              break
          case Methods.POST :
              this.createPostRoute(element, url)
              break
                  
        }

      });
    });

    module.exports = this.router;
    this.app.use(
      session({
        secret: "28392HKA!kdajajs**(229",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
      })
    );
    this.app.use("/", this.router);
    console.log("Done Bootstraping");
  }


  private serveRequest(element : any, request : Request, response : Response) : void{
    let parameter_count = element.parameter_count;
    let return_value = null;
    if (parameter_count > 0) {
            let params = element.params;
            let paramList: any = [];
            params.forEach((object: any, i: any) => {
              if (request.query[object.param] !== undefined)
                paramList.push(request.query[object.param]);
            });
            return_value = Reflect.apply(element.action, undefined, paramList);
          } else {
            return_value = Reflect.apply(element.action, undefined, []);
          }
          this.handleResponse(return_value, response)
  }

  private handleResponse(return_value : any, response : Response){
    if(return_value instanceof ModelAndView){
      const view = View.findView(return_value.getTemplateName())
      console.log(view)
      response.render(view, return_value.getAttributes())
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
      if (
        file.toLowerCase().indexOf("controller") > -1 &&
        file.toLowerCase().endsWith(".js")
      ) {
        console.log(br);
        require(br);
      }
      if (stat.isDirectory()) {
        this.scanComponents(path.join("/", file));
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

  private createGetRoute(properties : any, url:string){
    this.router.get(`/${url}`, (request, response, next) => {
      this.authenticated(properties.authenticated, request, response, next)
    },(request, response, next) =>{          
        this.serveRequest(properties, request, response)
    })
  }

  private createPostRoute(properties : any, url:string){
    this.router.post(`/${url}`, (request, response, next) => {
      this.authenticated(properties.authenticated, request, response, next)
    },(request, response, next) =>{          
        this.serveRequest(properties, request, response)
    })
  }

  private createPutRoute(properties : any, url:string){
    this.router.put(`/${url}`, (request, response, next) => {
      this.authenticated(properties.authenticated, request, response, next)
    },(request, response, next) =>{          
        this.serveRequest(properties, request, response)
    })
  }
  
}
