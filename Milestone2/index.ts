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
let artists:string[]=[];


// rootlocatie
app.get("/",(req,res)=>
    {
        const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "artiest";
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

//artists 

app.get("/artists",(req,res)=>
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
app.get("/artist/:id",(req,res)=>
    {
        let search:number = parseInt(req.params.id);

        let found:boolean=false;
        for (let i:number=0;i<songlist.length;i++)
            {
                if (songlist[i].artist_info.id==search)
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

    app.get("/artist/:id/extra_info",(req,res)=>
        {
            let search:number = parseInt(req.params.id);
            let found:boolean=false;
            for (let i:number=0;i<songlist.length;i++)
                {
                    if (songlist[i].artist_info.id==search)
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

app.get("/artist",(req,res)=>
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

 app.get("/songs",(req,res)=>
{
    let data:Songs[]=[];
    res.render("songs",
        {
            data:data,
            q:""
        }
    )
})

app.post("/songs",(req,res)=>
{
    let searchByTitle=req.body.q;
    let titleSongs:Songs[]=[];
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
            q:searchByTitle
        }
    )
})






  



app.listen(app.get("port"), async () => {
    let response:Response = await fetch("https://raw.githubusercontent.com/BergenChris/Milestone/main/Milestone2/songs.json");
    songlist= await response.json();
    console.log( "[server] http://localhost:" + app.get("port"));
  });


export {}