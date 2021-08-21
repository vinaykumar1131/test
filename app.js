
const express=require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ejs = require("ejs");
const bodyparse = require("body-parser");
const cookieparser=require('cookie-parser')

const app = express();
app.set('view engine', 'ejs');
app.use(bodyparse.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect( "mongodb+srv://test11:test11@cluster0.i4u9j.mongodb.net/test", {useNewUrlParser: true, useUnifiedTopology: true})
const logindata=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        minlength:10,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pass:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
        required:true
        }
    }]
});

logindata.pre("save",async function(next){
    if(this.isModified("pass")){
    console.log(this.pass);
    this.pass=await bcrypt.hash(this.pass, 10);
    console.log(this.pass);
    }
    next();
})

const login=mongoose.model("login",logindata);



app.get("/",function(req,res){
    res.render("front");
    
})
app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
});
app.get("/home",function(req,res){
    
res.render("home");
});
app.post("/register", async function(req,res){
    const name=req.body.usern;
    const number=req.body.num;
    const pass=req.body.pass;
  
    const email=req.body.email;
    var err="";
     const ele=login.findOne({email:email});
     const emailc=ele.email;
    if(email==emailc){
       err="EMAIL IS ALREADY EXIXTS";
        res.render("register",{'err':err});
    }else{
    const users=new login({
        name:name,
        number:number,
        email:email,
        pass:pass
    });
   
 
    users.save();
 res.redirect("/home");
}
});
app.post("/login",async (req,res)=>{
    try{
    const email=req.body.email;
    const pass=req.body.pass;
    const ele= await login.findOne({email:email});
    console.log(ele.name);
    const ismatch=await bcrypt.compare(pass,ele.pass);


    if(ismatch){
        res.redirect("/home");
    }
    else{
        res.redirect("/login");
    }
}
catch(err){
    console.log(err);
}
})





app.listen(process.env.PORT || 180,function(){
    console.log("hi your server is ready");
})