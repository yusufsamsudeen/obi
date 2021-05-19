import { expect } from 'chai';
var session = require('supertest-session');
import { Volcry } from './../src/app';
import { Application } from "express"


describe("Build App", ()=>{

    let app : Application
    let volcry = new Volcry({port : 3000, base_scan : "./tests/example"})
    app = volcry.start()
    // let agent = request.agent(app)
    let testSession = session(app)
    var authenticatedSession = testSession;
    
    beforeEach(()=>{
        
    })

    it("server started", (done)=>{
        testSession.get("/").expect(200, done)
    })

    it("return view only", (done)=>{
        testSession.get("/about").expect(200, done)
    })

    it("return view with data", (done)=>{
        testSession.get("/view").expect(200, done)
    })

    it("Authenticated Route", (done)=>{
        testSession.get("/authenticated").expect(302, done)
    })

    it("Login", (done) => {
        testSession.post("/login").expect(200)
        .end( (err : any) => {
            authenticatedSession = testSession;
            return done();
          });
   
       
    })


    it("Authentication", (done) => {
        authenticatedSession.get("/authenticated").expect(200, done)
          
    })

    it("With Request Param", (done)=>{
        testSession.get("/main?param=hi&param2=sam").expect(200, done)
    })

    it("mounted index", (done)=>{
        testSession.get("/mounted/index").expect(200, done)
    })

    it("self-auth", (done) => {
        testSession.get("/mounted/self-auth").expect(200, done)
    })

    it("json", (done) => {
        testSession.get("/json").expect(200, done)
    })

    it("test redirect", (done) => {
        testSession.get("/redirect").expect(302, done)
    })

    it("test void", (done) => {
            testSession.get("/test-void").expect(200, done)
    })

    it("test put", (done) => {
        testSession.put("/test-put").expect(200, done)
    })

    it("Model Attributes", (done) => {
        testSession.post("/mounted/test-model-attribute")
            .send({username : "volcry", password : "111"})
            .expect(200)
            .end((err : any, res : any)=>{
                expect(res.body).to.have.property('username', 'volcry')
                done()
            })
    })

    it("Path Variable", (done) => {
        testSession.get("/mounted/path/volcry")
            .expect(200)
            .end((err :any, res : any) => {
                expect(res.body).to.have.property("username", "volcry")
                done()
            })
    })


})