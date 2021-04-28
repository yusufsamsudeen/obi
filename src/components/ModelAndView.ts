export class ModelAndView{
    private template : string
    private attributes: any = {}
    
    constructor(template : string){
        this.template = template
    }

    public addAttribute(key : string, value:unknown):void{
        this.attributes[key] = value;
    }

    public getTemplateName() : string{
        return this.template
    }

    public getAttributes() : any {
        return this.attributes
    }
}