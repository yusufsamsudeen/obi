import { ParameterType } from "./types/paramtype"
import { addParameter } from "./util"
import "reflect-metadata";


export function ModelAttribute(paramType : Function){
    return function(target : any, propertyKey : string | symbol , parameterIndex : number){
        let class_name = target.constructor.name.toLowerCase()
        let method_name = propertyKey.toString().toLowerCase()
        var type = Reflect.getMetadata("design:paramtypes", target, propertyKey);
        
        var s = type.map((a: { name: any; }) => a.name).join();
        // console.log(`${propertyKey} type: ${type.name}`);
        console.log(` param types: ${s}`);
        console.log(paramType)
        console.log(Reflect.construct(paramType, []))
        
        addParameter(class_name, method_name, "", parameterIndex, ParameterType.MODEL_ATTRIBUTE, Reflect.construct(paramType, []))
    }
}