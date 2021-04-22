import { ComponentTree } from '../params/ComponentTree';
import { request, response } from "express";
import callsite from "callsites";
export function Controller(options: any = {}) {
  return function (constructor: Function) {
    constructor.prototype.request = request;
    constructor.prototype.response = response;

    if (ComponentTree.controllers === undefined) ComponentTree.controllers = [];

    let path: any = callsite()
      .find((f: any) => f.getFileName()?.includes(constructor.name))
      ?.getFileName();
    path = path.substring(path.indexOf("dist"));
    path = path.replace("\\", "/");
    ComponentTree.controllers[constructor.name] = {
      class_name: constructor.name,
      path: "./" + path,
      controller : constructor.prototype
    };

  };

 
}
