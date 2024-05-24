
import express  from "express";
import {Songs,Genre} from "./interfaces/songs";
import {User} from "./interfaces/users";
import ejs from "ejs";
import { connect,getSongs,getSongById,updateSong, login, createNewUser} from "./database";
import session from "./session";
import { secureMiddleware, secureMiddlewareAdmin } from "./secureMiddleware";








const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);



app.use(session);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let songlist:Songs[]=[];
let artists:string[]=[];




// rootlocatie

app.get("/", secureMiddleware, async(req, res) => 
    {
        songlist = await getSongs();
        const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "id";
        const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "a-z laag-hoog";
        let sortedSonglist=[...songlist].sort((a,b)=>
        {
            if (sortField ==="titel")
            {
                return sortDirection==="a-z laag-hoog"?a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            }
            else if (sortField==="artiest")
            {
                return sortDirection==="a-z laag-hoog"?a.artist.localeCompare(b.artist) : b.artist.localeCompare(a.artist);
            }
            else if (sortField==="genre")
                {
                    return sortDirection==="a-z laag-hoog"?a.genre.localeCompare(b.genre) : b.genre.localeCompare(a.genre);
                }
            else if (sortField==="weken op 1")
            {
                return sortDirection==="a-z laag-hoog"?a.weeks_at_number_one- b.weeks_at_number_one : b.weeks_at_number_one-a.weeks_at_number_one;
            }
            else if (sortField==="jaar")
            {
                return sortDirection==="a-z laag-hoog"?a.year- b.year : b.year-a.year;
            }
            else
            {
                return 0;
            }  
        });
    
        for(let i:number=0;i<songlist.length;i++)
            {
                if (artists.includes(songlist[i].artist) == false)
                    {
                        artists.push(songlist[i].artist)
                    }
                
                
            }
    
        const sortFields = 
        [
            { value: 'artiest', text: 'Artiest', selected: sortField === 'artiest' ? 'selected' : ''},
            { value: 'titel', text: 'Titel', selected: sortField === 'titel' ? 'selected' : '' },
            { value: 'genre', text: 'Genre', selected: sortField === 'genre' ? 'selected' : ''},
            { value: 'weken op 1', text: 'Weken op 1', selected: sortField === 'weken op 1' ? 'selected' : ''},
            { value: 'jaar', text: 'Jaar', selected: sortField === 'jaar' ? 'selected' : ''},
        ];
        const sortDirections = 
        [
            { value: 'a-z laag-hoog', text: 'A-Z Laag-Hoog', selected: sortDirection === 'a-z laag-hoog' ? 'selected' : ''},
            { value: 'z-a hoog-laag', text: 'Z-A Hoog-Laag', selected: sortDirection === 'z-a hoog-laag' ? 'selected' : ''}
        ];
    
        res.render("index",
            {
                
                sortFields: sortFields,
                sortDirections: sortDirections,
                sortField: sortField,
                sortDirection: sortDirection,
                songs:sortedSonglist,
                artist:"",
                q:""
            }
        )
    });

app.post("/",(req,res)=>
{
    let nameArtist:string=req.body.q;
    let songsByArtist=[...songlist].filter(song=>song.artist.toLowerCase().includes(nameArtist.toLowerCase()));
    res.render("index",
    {
        sortFields: null,
        sortDirections: null,
        sortField: null,
        sortDirection: null,
        songs:songsByArtist,
        artist:nameArtist,
        q:nameArtist
    });

})

//login en logout
app.get("/login", (req, res) => {
    let message1 = {type: "Hey, ", message: "log je hier in aub"}
    res.render("login",{
        message: message1,
    });
});

app.post("/login", async(req, res) => {
    const email : string = req.body.email;
    const password : string = req.body.password;
    try {
        let user : User = await login(email, password);
        delete user.password; 
        req.session.user = user;
        res.redirect("/");
    } catch (e : any) {
        let message1 = {type: "Hey,", message: " er is iets fout gegaan."}
        res.render("login",{
            message:message1,
        });
    }
});

app.get("/logout", async(req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});


//registreet

app.get("/register", (req,res)=>{
    res.render("register");
})

app.post("/register",async (req,res)=>{
    const email : string = req.body.email;
    const password : string = req.body.password;
    try{
        await createNewUser(email,password);
        let message1 = {type: "Hey,", message: " registratie is gelukt. Log je nu in"}
        res.render("login",{
            message:message1,
        });
    
    }
    catch (e){
        let message1 = {type: "Hey,", message: "gebruiker bestaat reeds"}
        res.render("login",{
            message:message1,
        });
    }
})

//artists 

app.get("/artists",secureMiddleware, (req,res)=>
{
    res.render("artists",
        {
            list:artists,
            q:"",
            data:[],
        }
    )
})

app.post("/artists",(req,res)=>
{
    let nameArtist:string=req.body.q;
    let filteredSonglist:Songs[]=[];
    for (let i:number=0;i<songlist.length;i++)
        {
            if (songlist[i].artist.toLowerCase().includes(nameArtist.toLowerCase()))
                {
                    filteredSonglist.push(songlist[i]);
                }
        }
    res.render("artists",
        {
            list:artists,
            data:filteredSonglist,
            q:nameArtist
        })
})


///artist
app.get("/artist/:id",secureMiddleware,(req,res)=>
    {
        let search:string = req.params.id;

        let found:boolean=false;
        for (let i:number=0;i<songlist.length;i++)
            {
                if (songlist[i].artist_info.artistid==search)
                    {
                        found=true;
                        res.render("artist",
                        {
                            list:artists,
                            data:songlist[i]
                            
                        })
                        break;
                    }
            }
        if (found == false)
        {
            res.render("404");
        }
    });

app.get("/artist/:id/extra_info",secureMiddleware,(req,res)=>
        {
            let search:string = req.params.id;
            let found:boolean=false;
            for (let i:number=0;i<songlist.length;i++)
                {
                    if (songlist[i].artist_info.artistid==search)
                        {
                            found=true;
                            res.render("extra_info",
                            {
                                list:artists,
                                data:songlist[i]
                                
                            })
                            break;
                        }
                }
            if (found == false)
            {
                res.render("404");
            }
        });

app.get("/artist",secureMiddleware,(req,res)=>
{
    res.render("artist",
                    {
                        list:artists,
                        data:songlist[0]
                    })
   
});

app.use("/artist",(req,res)=>
    {
        let searchbyArtist:string=req.body.q;
        let artistId:Songs=songlist[0];
        
        for(let i:number=0;i<songlist.length;i++)
            {
                if (searchbyArtist == songlist[i].artist)
                {
                    artistId=songlist[i];
                }
            }
        res.render("artist",
            {
                list:artists,
                data:artistId,
                q:null
            })

    });
 // songs

 app.get("/songs",secureMiddleware,(req,res)=>
{
    let data:Songs[]=songlist;
    let user = req.session.user;
    res.render("songs",
        {
            data:data,
            q:"",
            user:user
        }
    )
})

app.post("/songs",(req,res)=>
{
    let searchByTitle=req.body.q;
    let titleSongs:Songs[]=[];
    let user = req.session.user;
    for( let i:number=0;i<songlist.length;i++)
        {
            if (songlist[i].title.toLowerCase().includes(searchByTitle.toLowerCase()) || songlist[i].chorus.toLowerCase().includes(searchByTitle.toLowerCase()))
                {
                    titleSongs.push(songlist[i]);
                }
        }
        res.render("songs",
        {
            data:titleSongs,
            q:searchByTitle,
            user:user
        }
    )
})

app.get("/songs/:id/update",secureMiddlewareAdmin,async(req,res)=>
{
    let id:string=req.params.id;
    let song:Songs|null = await getSongById(id);
    let user = req.session.user;
    console.log(user!.role);
    if (!song )
    {
        res.redirect("/songs");
        return;
    }
    let genres:Genre[]=["COUNTRY","EDM","FUNK","HIP_HOP","POP","RNB"];
    res.render("songs/update",
        {
            genres:genres,
            song:song,
        }
    );
})

app.post("/songs/:id/update",async(req,res)=>
    {
        let idsong:string=req.params.id;
        let song:Songs|null = req.body;
        let user = req.session.user;
        if (!song && user!.role !=="ADMIN")
        {
            res.redirect("/songs");
            return;
        }
        await updateSong(idsong,song!);
        res.redirect("/");     
        
    })

app.listen(app.get("port"), async () => {
    await connect();
    console.log( "[server] http://localhost:" + app.get("port"));
  });


export {}