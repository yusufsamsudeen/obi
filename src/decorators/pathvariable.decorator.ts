import { PathVariableOptions } from './options/pathvariable.options';
import { ParameterType } from "./types/paramtype"
import { addParameter } from "./util"

export function PathVariable(options : PathVariableOptions){
    return function(target : any, propertyKey : string | symbol, parameterIndex : number){
        let class_name = target.constructor.name.toLowerCase()
        let method_name = propertyKey.toString().toLowerCase()
        addParameter({class_name : class_name, method_name : method_name, param_name : options.param, index : parameterIndex,
             type : ParameterType.PATH_VARIABLE, required : options.required})
    }
}