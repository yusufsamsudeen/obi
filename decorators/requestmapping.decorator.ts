import { ComponentTree } from './../params/ComponentTree';
import { Methods } from "./requestmethod.decorator";
import { initTree } from "./util";
export function RequestMapping(options : any) {
  if(!options.hasOwnProperty("url"))
      throw new Error("Property URL must be present")
  if(!options.hasOwnProperty("method"))
      throw new Error("Property method must be present")
      
  let url = options.url
  let method = options.method
  if(!Object.values(Methods).includes(method))
      throw new Error("Property method must be of type Method")

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    
    let class_name : string = target.constructor.name.toLowerCase()  
    let method_name : string = propertyKey.toLowerCase()
    initTree(class_name, method_name)
    ComponentTree.components[class_name].methods[method_name].url = url.replace(/\/$/, "");
    ComponentTree.components[class_name].methods[method_name].action = target[propertyKey]
    ComponentTree.components[class_name].methods[method_name].parameter_count = getParamNames(target[propertyKey]).length
    ComponentTree.components[class_name].methods[method_name].method = method.toString()

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
