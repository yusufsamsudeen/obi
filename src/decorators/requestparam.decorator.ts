import { addParameter } from '../util/util';
import { PathVariableOptions } from './options/pathvariable.options';
import { ParameterType } from './types/paramtype';
export function RequestParam(param : PathVariableOptions){
    return function(target : any, propertyKey : string | symbol, parameterIndex : number){
        let class_name = target.constructor.name.toLowerCase()
        let method_name = propertyKey.toString().toLowerCase()
        addParameter({class_name : class_name, method_name : method_name, param_name :param.param, index: parameterIndex, type : ParameterType.QUERY_PARAM, required : param.required})

    }
}