const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

app.set("view-engine" , ejs);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB" , {useNewUrlParser:true});
const wikiSchema = {
  title : String ,
  content :String
}

const Article = mongoose.model("article" , wikiSchema);

//Chained Routing using express.......................

app.route("/articles")

//get API to read the data from database..................

.get(function(req , res){
  Article.find(function(err, foundArtricles){
    if(!err){
      res.send(foundArtricles);
    }else{
      res.send(err);
    }

  });
})
////////\/\\\\\\\\\\\\\\\\\\\\Test target all articles \\\\///////////////////////

//post API to create data in database...............

.post( function(req, res){
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("successfully added data in database");
    }else{
      res.send("error to add the data");
    }
  });
})

//delete API to delte the data from database...................

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      console.log("successfully deleted the data from database");
    }else{
      console.log(err);
    }
  });
});



////////\/\\\\\\\\\\\\\\\\\\\\Test target specific article \\\\///////////////////////


//chain routing specific path..................
app.route("/articles/:articleTitle")


//get API to read a specific path.....................

.get(function(req , res){
  Article.findOne({title:req.params.articleTitle} , function(err , foundArtricles){
    if(foundArtricles){
      res.send(foundArtricles);
    }else{
      res.send("no article found ................");
    }
  });
})

//put API to update the particular article as a whole article...............

.put(function(req, res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title , content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        console.log("successfully updated the data in database....");
      }
    }
  );
})

//patch API to update the particular article at particular feild only ..........
.patch(function(req, res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err , result){
      if(!err){
        res.send("successfully updated particular data");
      }else{
        res.send(err);
      }
  });
})

.delete(function(req, res){
  Article.deleteOne(
    {title:req.params.articleTitle} ,
    function(err){
      if(!err){
        res.send("successfully deleted the particular data from database.....");
      }else{
        res.send(err);
      }
    }
  );
});



app.listen(3000 , function(){
  console.log("Server is running on port 3000");
})
