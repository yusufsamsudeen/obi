import { ComponentTree } from './params/ComponentTree';
import express  from "express"
import fs from "fs"
import path from "path"
import crayon from 'crayon.js';

export  class App{

    private port : number
    private app: any
    private baseScan: string

    constructor(port:number, baseScan : string){
        this.port = port
        this.app = express()
        this.baseScan = baseScan
    }

    start() : void {
        this.scanComponents(this.baseScan)
        this.bootstrap()
        this.app.listen(this.port, () =>{
            console.log(`Server started on port ${this.port}`)
        })

    }

    private bootstrap() : void{
        console.log(crayon.bgAliceBlue.white("Bootstraping"))
        
        let router = express.Router()
        ComponentTree.requestRoutes.forEach((item : any, index : any) => {
            
            
            let params = ComponentTree.requestParameters[item.class.toLowerCase()][item.action.toLowerCase()]
            router.get(`/${item.url}`, function(request, response){
                let parameter_count = item.parameter_count
                let return_value = null
                if(parameter_count>0){
                    let paramList: any = []
                    params.forEach((object : any, i : any) => {
                        if(request.query[object.param]!==undefined)
                            paramList.push(request.query[object.param])
                    })
                    return_value = Reflect.apply(item.actionMethod, undefined, paramList)
                }else{
                    return_value = Reflect.apply(item.actionMethod, undefined, [])
                }
                if(return_value==undefined)
                    response.send()
                else
                    response.send(return_value)    
                
            })
            
        });
        module.exports = router
        this.app.use("/", router)
        console.log("Done Bootstraping")

    }

    

    private scanComponents(baseRoute: string){
        baseRoute = path.resolve(baseRoute)

        let files = fs.readdirSync(baseRoute)
        for(let file of files){
            let br = path.join(path.resolve(baseRoute),"/",file)
            let stat= fs.statSync(path.resolve(br))
            if(file.toLowerCase().indexOf("controller")>-1 && file.toLowerCase().endsWith(".js")){
                console.log(br)
                require(br);
            }
            if(stat.isDirectory()){
                this.scanComponents(path.join("/",file))
            }
        }
      
    }

    
}