import { Volcry } from './../src/app';
import { Application } from "express"
let mockSession = require('mock-session');
import request from "supertest"

describe("Build App", ()=>{

    let app : Application
    let volcry = new Volcry(3000, "example")
    app = volcry.start()
    let agent = request.agent(app)
    
    let cookie = mockSession('my-session', 'my-secret', {"count":1});
    beforeEach(()=>{
        
    })

    it("server started", (done)=>{
        agent.get("/").expect(200, done)
    })

    it("return view only", (done)=>{
        agent.get("/about").expect(200, done)
    })

    it("return view with data", (done)=>{
        agent.get("/view").expect(200, done)
    })

    it("Authenticated Route", (done)=>{
        agent.get("/authenticated").expect(401, done)
    })

    it("Login", (done) => {
        agent.post("/login").set('Cookie', [cookie]).expect(200,done)
    })

    it("With Request Param", (done)=>{
        agent.get("/main?param=hi&param2=sam").expect(200, done)
    })

    it("Authenticated Success", (done)=>{
        agent.get("/login-redirect").set('Cookie', [cookie]).expect(302)
            .expect("Location", "main")
            .end(done)
    })

})