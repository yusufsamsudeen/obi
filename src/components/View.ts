import pug, { compileTemplate } from "pug"
export class View {

    static findView(view_name : string) : string{
        view_name = view_name.replace(".", "/")
        view_name = `${view_name}.pug`
        return view_name
    }
}