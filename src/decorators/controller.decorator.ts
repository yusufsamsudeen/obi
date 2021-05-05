import { ControllerOptions } from './options/controller.options';
import { request, response } from "express";
import { ComponentTree } from "../params/ComponentTree";
import { initTree } from '../util/util';
export function Controller(options: ControllerOptions = {}) {
  
  return function (constructor: Function) {
    constructor.prototype.request = request;
    constructor.prototype.response = response;
    let constructor_name = constructor.name.toString().toLowerCase()
    initTree(constructor_name)
    if(options.url){
      ComponentTree.components[constructor_name].base_url= options.url
    }
    if(options.authenticated){
      ComponentTree.components[constructor_name].authenticated= options.authenticated

    }
    ComponentTree.components[constructor_name].constructor = constructor
    
  };

 
}
