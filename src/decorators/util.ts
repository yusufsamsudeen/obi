import { ComponentTree } from './../params/ComponentTree';
export function initTree(class_name : string, method_name : string = "") {
    if (!ComponentTree.components.hasOwnProperty(class_name)) {
        ComponentTree.components[class_name] = {
            base_url: null,
            methods: []
        };
    }
    if (method_name == "" || method_name == undefined)
        return;
    if (ComponentTree.components[class_name].methods[method_name] == undefined)
        ComponentTree.components[class_name].methods[method_name] = {};
}