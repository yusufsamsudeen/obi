import { ResponseBody, RequestMapping, Methods, Authenticated, RequestParam, ModelAndView } from '../../src';
import { BaseController } from '../../src/components/BaseController';
import { Controller } from '../../src/decorators/controller.decorator';

@Controller()
export class HomeController extends BaseController{
    

    @ResponseBody()
    @RequestMapping({url :"/", method: Methods.GET})
    public index() : string{
        return ""
    }

    @Authenticated()
    @RequestMapping({url: "authenticated", method : Methods.GET})
    public params() : void{
    //    console.log("Welcome")
    }

    @RequestMapping({url: "about", method : Methods.GET})
    public about():string{
        return "aboutus";
    }

    @RequestMapping({url : "view", method : Methods.GET})
    public view() : ModelAndView{
        let mv = new ModelAndView("index")
        mv.addAttribute("username", "yusufalgorithm")
        return mv
    }

    @ResponseBody()
    @RequestMapping({url : "json", method:Methods.GET})
    public json() : Object{
        return {body :"welcome"}
    }

    @ResponseBody()
    @RequestMapping({url : "login", method:Methods.POST})
    public login() : Object{
        let user = {username : "volcry", id : 111}
        this.request.session!.user = user
        return user
    }

   

    @RequestMapping({url :"main", method :Methods.GET})
    public main(@RequestParam("param") param : string, @RequestParam("param2") param2 : string) : void{
        let user = {username : "volcry", id : 111}
        this.request.session!.user = user        
    }

    @RequestMapping({url : "redirect", method : Methods.GET})
    public redirect() : string{
        return ":about"
    }

    @RequestMapping({url : "test-void", method : Methods.GET})
    public testVoid() : void{

    }

    @RequestMapping({url : "test-put", method : Methods.PUT})
    public testPut() : void{

    }

}