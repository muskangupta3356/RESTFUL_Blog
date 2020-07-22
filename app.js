var express = require("express");
var methodOverride =require("method-override");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");

//title ,image ,body,created-date
//app config
mongoose.connect("mongodb://localhost/restful_blog_app" ,{ useNewUrlParser:true , useUnifiedTopology:true  } );
app.set("view engine","ejs");
app.use(express.static("public"));//css
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); //must be afetr body parser
app.use(methodOverride("_method"));

//mongoose/model/config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{type:Date,default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);
// Blog.create({
//     title:"test Blog",
//     image:"",
//     body:"this is my first blog"
// });

//restful routes
app.get("/",function(req,res){
res.redirect("/blogs");
});
//index route
app.get("/blogs",function(req,res){
   Blog.find({},function(err,blogs){
    if(err){

        console.log("error!");
    }
    else{
       res.render("index",{blogs:blogs});
    }
   });
   
});

//new route

app.get("/blogs/new",function(req,res){
   res.render("new");
});

//create route
app.post("/blogs",function(req,res){
     //create blog and redirect
     req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
      if(err)
      {
          res.render("new");
      }
      else
      {
          res.redirect("/blogs");
      }
    });

});

//show route
app.get("/blogs/:id",function(req,res){
   Blog.findById(req.params.id, function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       }
       else{
           res.render("show",{blog:foundBlog});
       }
       
   });
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }     
    });   

});

//update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
        res.redirect("/blogs");
    }
    else{
        res.redirect("/blogs/"+req.params.id);
    }
  }) ;

});

//destroy route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndDelete(req.params.id,function(err){
          if(err){
              res.redirect("/blog");
          }
          else
          {
              res.redirect("/blogs");
          }
    });
    
});



app.listen(3000,function(req,res){
    console.log("server 3000 is running");
});
