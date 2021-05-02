import { ParameterType } from "./paramtype";

export interface ParamNamedParameters{
    class_name: string, 
    method_name: string, 
    param_name?: string, 
    index: number, 
    type: ParameterType, 
    model? : Function, 
    required? : boolean
}