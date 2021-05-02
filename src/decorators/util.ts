import { ParamNamedParameters } from './types/paramparameters';
import { ComponentTree } from "./../params/ComponentTree";
import { ParameterType } from "./types/paramtype";
import {Request} from "express"
import { exception } from 'node:console';
export function initTree(class_name: string, method_name: string = "") {
    if (!ComponentTree.components.hasOwnProperty(class_name)) {
        ComponentTree.components[class_name] = {
            base_url: null,
            methods: [],
        };
    }
    if (method_name == "" || method_name == undefined) return;
    if (ComponentTree.components[class_name].methods[method_name] == undefined) ComponentTree.components[class_name].methods[method_name] = {};
}

export function addParameter({class_name, method_name, param_name, index, type, 
    model, required} : ParamNamedParameters): void {
    initTree(class_name, method_name)
    if(!ComponentTree.components[class_name].methods[method_name].hasOwnProperty("params"))
        ComponentTree.components[class_name].methods[method_name].params = []

    ComponentTree.components[class_name].methods[method_name].params.push({
        name: param_name,
        index: index,
        type : type,
        model : model,
        required : required
    });
}

export function extractMethodParameters(params : any[], request : Request) : any{

    params.sort((a: any, b: any) => (a.index > b.index ? 1 : b.index > a.index ? -1 : 0));
    let paramList : any = []
      params.forEach((object: any, i: any) => {
          switch (object.type){
              case ParameterType.QUERY_PARAM:
                if (object.required && request.params[object.name] === undefined)
                    throw new Error(`Property ${object.name} is required`)
                paramList.push(request.query[object.name]);
                break;
              case ParameterType.PATH_VARIABLE:
                  if (object.required && request.params[object.name] === undefined)
                    throw new Error(`Property ${object.name} is required`)
                paramList.push(request.params[object.name])  
                break
              case ParameterType.MODEL_ATTRIBUTE:
                paramList.push(extractModelAttribute(request, object.model!))
                break
          }
      });

    return paramList  

}

function extractModelAttribute(request : Request, model : Function){

    let keys = Object.getOwnPropertyNames(model)
    for(let key in keys){
        let object_key = keys[key]
        Reflect.set(model, object_key, request.body[object_key])
    }
    return model
}


