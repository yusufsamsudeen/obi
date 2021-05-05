# Volcry

Vocry is a TypeScript MVC framework inspired by Java SpringBoot and PHP Laravel. It brings the syntactic sugar of SpringBoot Annotations to the world JavaScript with the help of TypeScript decorators.

Quickly start development by just annotating your class with `@Controller` to mark the class as Controller and functions with `@RequestMapping` to mark it as an endpoint.

## Installation
```bash
npm install volcry
```


## Usage

Create Application Boot points

```TypeScript
import { Volcry } from "volcry";
let app = new Volcry(3000, "dir")
app.start()
```

### Create Controller

```TypeScript
@Controller()
export class MainController{

    @RequestMapping({url : "/", method : Methods.GET})
    public index() : string{
        return "index"
    }

}
```
This will create an endpoint at `\` and return a pug view with filename `index.pug` located in a folder called `resources` in the root path of the project.

### Available Request Methods

```TypeScript
Methods.GET
Methods.POST
Methods.PUT
Methods.DELETE
```
### Protected Routes

To protect a route, simply decorate the route with `@Authenticated` decorator or

```TypeScript
@RequestMapping({url : "secured-url", method : Method.GET, authenticated : true})
```

This will also protect the route and make it available for only authenticated user.

You can also protect all routes within a controller by adding the authenticated flag to the controller like this :

```TypeScript
@Controller({authenticated : true})
```
All actions under a controller can be mounted onto a base route by specifying the url flag in the controller decorator

```TypeScript
@Controller({url : "base-url"})
```

If a controller is marked to be authenticated, an action under the controller can be exempted from authentication by setting the `authenticated` flag to `false` in the `@RequestMapping`.

If an unauthenticated request comes in and it is a json request, a `401 Unauthorised` is returned else it will be redirected to the login route.

### Middleware

The `@RequestMapping` decorator also allows for `Middleware` Plugin. This is achieved through the `Middleware` flag of the decorator.

The middleware must however implement the `IMiddleware` interface. An example is shown below

```TypeScript
import { IMiddleware } from 'volcry';
import { NextFunction, Request, Response } from "express";

export class TestMiddleware implements IMiddleware{
    request!: Request;
    response!: Response;
    next!: NextFunction;

    fire() {
        if(this.request.is('application/json'))
            next()
        else
           return response.redirect("home")    
    }
}
```
This checks if the request is a json request and calls the `next()` function else the request is redirected to the `home`

This middle can then be applied to a route like this

```TypeScript
@RequestMapping({url : "middleware", method : Methods.GET, middleware : TestMiddleware})
   public testMiddleware() : void{
}
```

### Redirects

To handle redirect is quiet simple in volcry. Just return a string to the desired route preceeded with `:` 

```TypeScript
@RequestMapping({url : "redirect", method : Methods.GET})
public redirect() : string{
    return ":about"
}
```
This will redirect to the route `:about`

### JSON Response

To Return a json response simply decorate the action with `@ResponseBody`. This will automagically serialize the return object to a `json`

### Request Param

To get value from request, simply decorate your action parameter with `@RequestMapping` decorator and pass the parameter name in the param flag, you can also specify the `required` flag. If the `required` flag is set to `true` and the value is not found in the request. An error will be thrown. An example is illustrated below

```TypeScript
@RequestMapping({url :"main", method :Methods.GET})
public main(@RequestParam({param :"param", required  :true}) param : string, 
    @RequestParam({param :"param2"}) param2 : string) : void{
    let user = {username : param, id : param2}
}
```

### Path Variable

To get value from the request url path, simply decorate your action parameter with `@PathVariable` decorator. It works just like the `@RequestParam` decorator specified above. An example is illustrated below

```TypeScript
 @RequestMapping({url : "path/:username", method : Methods.GET})
public pathVariable(@PathVariable({param : "username", required : true}) username : string) : Object{
    return {username : username}
}
```
This will extract the `username` in the url

### Form Handling

You can directly serialize your submitted form to a specified object of your choice. To achieve this, all you need to do is to decorate your action parameter with `@ModelAttribute` and specify the class of your choice. An example is illustrated below

```TypeScript
@ResponseBody()
@RequestMapping({url : "test-model-attribute", method : Methods.POST})
public testModelAttribute(@ModelAttribute(User) user : User) : User{
    return user
}
```
Volcry will attempt to serialize the form or request to a `User` and pass it to the funtion.

### Binding Model to Views

You can bind a model to be passed to a desired view by simply returning the `ModelAttribute` class from an action

```TypeScript
@RequestMapping({url : "view", method : Methods.GET})
public view() : ModelAndView{
    let mv = new ModelAndView("index")
    mv.addAttribute("username", "volcry")
    return mv
}
```
In the above, `index` passed to the `ModelAndView` constructor is the view file and the attributes is a key value pair that can be called multiple times.