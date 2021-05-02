import { ParameterType } from "./types/paramtype"
import { addParameter } from "./util"


export function ModelAttribute(paramType : Function){
    return function(target : any, propertyKey : string | symbol , parameterIndex : number){
        let class_name = target.constructor.name.toLowerCase()
        let method_name = propertyKey.toString().toLowerCase()
        addParameter({class_name : class_name, method_name : method_name, index :parameterIndex, 
            type :ParameterType.MODEL_ATTRIBUTE, model : Reflect.construct(paramType, [])})
    }
}