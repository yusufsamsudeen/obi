import { Methods } from './decorators/requestmethod.decorator';
import { ComponentTree } from "./params/ComponentTree";
import express from "express";
import fs from "fs";
import path from "path";
import crayon from "crayon.js";
import util from "util";

export class App {
  private port: number;
  private app: any;
  private baseScan: string;

  constructor(port: number, baseScan: string) {
    this.port = port;
    this.app = express();
    this.baseScan = baseScan;
  }

  start(): void {
    this.scanComponents(this.baseScan);
    this.bootstrap();
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }

  private bootstrap(): void {
    console.log(crayon.greenYellow("Bootstraping"));
    console.log(util.inspect(ComponentTree.components, false, null, true));

    let router = express.Router();
    Object.entries<any>(ComponentTree.components).forEach(([index , item  ])=>{
        console.log("ITEM")
        console.log(item)
        let base_url = item.base_url
        Object.entries<any>(item.methods).forEach(([index_ , element  ])=>{

            let url:string = base_url!=null && base_url!=undefined ? base_url+"/"+element.url : element.url
            url = url.replace(/\/$/, "")
            console.log(`URL ${url}`)
            router.get(`/${url}`, function(request, response){
                let parameter_count = element.parameter_count
                let return_value = null
                if(parameter_count>0){
                    let params = element.params
                    let paramList: any = []
                    params.forEach((object : any, i : any) => {
                        if(request.query[object.param]!==undefined)
                            paramList.push(request.query[object.param])
                    })
                    return_value = Reflect.apply(element.action, undefined, paramList)
                }else{
                    return_value = Reflect.apply(element.action, undefined, [])
                }
                if(return_value==undefined)
                    response.send()
                else
                    response.send(return_value)
    
            })
        });
    })
   
    module.exports = router;
    this.app.use("/", router);
    console.log("Done Bootstraping");
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
}
