import { ParameterType } from "./types/paramtype"
import { addParameter, initTree } from "./util"

export function PathVariable(paramName : string){
    return function(target : any, propertyKey : string | symbol, parameterIndex : number){
        let class_name = target.constructor.name.toLowerCase()
        let method_name = propertyKey.toString().toLowerCase()
        addParameter(class_name, method_name, paramName, parameterIndex, ParameterType.PATH_VARIABLE)
    }
}