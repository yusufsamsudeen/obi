import { ComponentTree } from './../params/ComponentTree';
export function RequestParam(paramName : string){
    return function(target : any, propertyKey : string | symbol, parameterIndex : number){
        if(ComponentTree.requestParameters === undefined)
            ComponentTree.requestParameters = [];
        
        if(ComponentTree.requestParameters[target.constructor.name.toLowerCase()]===undefined){
            ComponentTree.requestParameters[target.constructor.name.toLowerCase()] = []
        }
        if(ComponentTree.requestParameters[target.constructor.name.toLowerCase()] [propertyKey]===undefined){
            ComponentTree.requestParameters[target.constructor.name.toLowerCase()] [propertyKey] = []
        }
       
        ComponentTree.requestParameters[target.constructor.name.toLowerCase()] [propertyKey].push(
         
        {
            "param" : paramName,
            "funtion" : target[propertyKey],
            "index" : parameterIndex
        })
        
        
    }
}