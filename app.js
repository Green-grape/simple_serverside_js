const express=require("express");
const fs=require("fs");
const app=express();
const port=5502;
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "pug");
app.set("views","./views");
app.locals.pretty=true;

app.get("/topic/new", function(req,res){
    fs.readdir("data", function(err, files){
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error!");
        }
        res.render("new",{
            topics:files
        });
    });
});

app.get(["/topic","/topic/:title"], function(req, res){//[]를 이용해서여러개의 URL로 접근가능
    fs.readdir("data", function(err, files){
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error!");
        }
        const fileName=req.params.title;
        if(fileName){
            //title이 존재할때
            fs.readFile(`./data/${fileName}`, "utf8", function(err, data){
                if(err){
                    console.log(err);
                    res.status(500).send("Internal Server Error!");
                }
                res.render("topic", {
                    topics:files,
                    title:fileName,
                    description:data
                });
            });
        }else{
            //title이 존재하지 않을때
            res.render("topic",{
                topics:files,
                title:"Welcome",
                description:"Hello, JavaScript for server."
            });
        }
    });
});

app.post("/topic", function(req, res){
    const title=req.body.title;
    const des=req.body.description;
    fs.writeFile(`./data/${title}`, des, function(err){
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error!");//밑의 코드 실행X
        }
        res.redirect(`/topic/${title}`);
    });
})

app.listen(port, function(){
    console.log(`port ${port} is connected!`);
});