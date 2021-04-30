import { Controller, Methods, RequestMapping, ResponseBody } from "../../src";

@Controller({
    url : "mounted"
})
export class MountedPointController{

    @RequestMapping({url : "index", method : Methods.GET})
    @ResponseBody()
    public index() : string{
        return "mounted controller"
    }

    @ResponseBody()
    @RequestMapping({url : "self-auth", method : Methods.GET, authenticated : true})
    public selfAuthWithRequestMappingFlag():string{
        return "self-auth"
    }
}