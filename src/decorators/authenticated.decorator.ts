import { ComponentTree } from "../params/ComponentTree"
import { initTree } from "./util"

export function Authenticated(){
    return (target : any, propertyKey : string, descriptor : PropertyDescriptor) =>{
        let class_name : string = target.constructor.name.toLowerCase()  
        let method_name : string = propertyKey.toLowerCase()
        initTree(class_name, method_name)
        ComponentTree.components[class_name].methods[method_name].authenticated = true

    }
}