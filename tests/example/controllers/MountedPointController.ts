import { User } from './../models/User';
import { ResponseBody, RequestMapping, Methods, Controller } from '../../../src/';
import { BaseController } from '../../../src/components/BaseController';
import {ModelAttribute} from "../../../src/decorators/modelattribute.decorator"
import {PathVariable} from "../../../src/decorators/pathvariable.decorator"

@Controller({
    url : "mounted"
})
export class MountedPointController extends BaseController{

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

    @ResponseBody()
    @RequestMapping({url : "test-model-attribute", method : Methods.POST})
    public testModelAttribute(@ModelAttribute(User) user : User) : User{
        return user
    }

    @RequestMapping({url : "path/:username", method : Methods.GET})
    public pathVariable(@PathVariable({param : "username", required : true}) username : string) : Object{
        return {username : username}
    }
}