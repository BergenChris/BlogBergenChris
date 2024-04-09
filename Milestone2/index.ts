import readline from "readline-sync";
import express  from "express";
import {Songs} from "./interfaces/songs";
import ejs from "ejs";


const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let songlist:Songs[]=[];


app.get("/",(req,res)=>{
    res.render("index",
    {
        songs:songlist
    });
  });
  



app.listen(app.get("port"), async () => {
    let response:Response = await fetch("https://raw.githubusercontent.com/BergenChris/Milestone/main/Milestone2/songs.json");
    songlist= await response.json();
    console.log( "[server] http://localhost:" + app.get("port"));
  });


export {}