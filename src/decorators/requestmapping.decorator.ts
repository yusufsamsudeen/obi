import { ComponentTree } from '../params/ComponentTree';
import { RequestOptions } from './options/requestmapping.options';
import { initTree } from "./util";
export function RequestMapping(options : RequestOptions) {
  
      
  let url = options.url
  let method = options.method
  

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    
    let class_name : string = target.constructor.name.toLowerCase()  
    let method_name : string = propertyKey.toLowerCase()
    initTree(class_name, method_name)
    ComponentTree.components[class_name].methods[method_name].url = url.replace(/\/$/, "");
    ComponentTree.components[class_name].methods[method_name].action = target[propertyKey]
    ComponentTree.components[class_name].methods[method_name].parameter_count = getParamNames(target[propertyKey]).length
    ComponentTree.components[class_name].methods[method_name].method = method
    ComponentTree.components[class_name].methods[method_name].name = propertyKey


    if(options.authenticated!==undefined){
      ComponentTree.components[class_name].methods[method_name].authenticated = options.authenticated
    }

  };
}

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func: Function) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, "");
  var result = fnStr
    .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
    .match(ARGUMENT_NAMES);
  if (result === null) result = [];
  return result;
}
