import { ComponentTree } from './../params/ComponentTree';
import { initTree } from './util';
export function RequestParam(paramName : string){
    return function(target : any, propertyKey : string | symbol, parameterIndex : number){
        let class_name = target.constructor.name.toLowerCase()
        let method_name = propertyKey.toString().toLowerCase()
        initTree(class_name, method_name)
        if(!ComponentTree.components[class_name].methods[method_name].hasOwnProperty("params"))
            ComponentTree.components[class_name].methods[method_name].params = []
            
        ComponentTree.components[class_name].methods[method_name].params.push({
            "name" : paramName,
            "index" : parameterIndex
        })

    }
}