import { ComponentTree } from "../params/ComponentTree";
import { Methods } from "./requestmethod.decorator";
export function RequestMapping(url: string, method: Methods) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (ComponentTree.requestRoutes === undefined)
      ComponentTree.requestRoutes = [];

    ComponentTree.requestRoutes.push({
      url: url,
      method: method.toString(),
      action: propertyKey,
      class: target.constructor.name,
      actionMethod: target[propertyKey],
      filler: target,
      descriptor: descriptor,
      parameter_count : getParamNames(target[propertyKey]).length
    });
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
