import { request, response } from "express";
import { ComponentTree } from "../params/ComponentTree";
import { initTree } from './util';
export function Controller(options: any = {}) {
  
  return function (constructor: Function) {
    constructor.prototype.request = request;
    constructor.prototype.response = response;
    let constructor_name = constructor.name.toString().toLowerCase()
    initTree(constructor_name)
    if(options.hasOwnProperty("url")){
      ComponentTree.components[constructor_name].base_url= options.url
    }
    ComponentTree.components[constructor_name].constructor = constructor
    
  };

 
}
