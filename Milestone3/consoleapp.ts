import readline from "readline-sync";
import {Songs} from "./interfaces/songs";

let songlist:Songs[]=[];
async function importJson()
{
        let response:Response = await fetch("https://raw.githubusercontent.com/BergenChris/Milestone/main/Milestone3/songs.json");
        songlist= await response.json();
        return songlist;
    
}
importJson().then(songlist => 
{
    console.log();
    console.log("Welkom bij de JSON-viewer");
    console.log("");
    let choice:number=0;
    while (choice != 3)
    {
        console.log();
        console.log("1. Alle Data")
        console.log("2. Filer (ID)")
        console.log("3. Exit");
        console.log("");
        choice = readline.questionInt("Keuze : ");
        switch(choice)
        {
            case 1:
                for (let i:number=0;i<songlist.length;i++)
                    {
                        console.log("Id : "+songlist[i].id);
                        console.log("Titel : "+songlist[i].title) ;
                        console.log("Artiest : "+songlist[i].artist);
                        console.log("Afbeelding : "+songlist[i].image_url);
                        console.log("Jaar : "+songlist[i].year);
                        console.log("Datum : "+songlist[i].release_date) ;
                        console.log("Weken nr1 : "+songlist[i].weeks_at_number_one);
                        console.log("Refrein : "+songlist[i].chorus) ;
                        console.log("Nr1 in de UK : "+songlist[i].number_1_in_UK);
                        console.log("Genre : "+songlist[i].genre) ;
                        for (let i:number=0;i<songlist[i].other_top_songs.length;i++)
                        {
                            console.log("Andere hits : "+songlist[i].other_top_songs[i]); 
                        }
                        console.log("Extra info "+songlist[i].artist+" : ") ;
                        console.log("\tEchte naam : "+songlist[i].artist_info.full_name);
                        console.log("\tGeboren in : "+songlist[i].artist_info.country) ;
                        console.log("\tGeboortedatum : "+songlist[i].artist_info.birthdate);
                        for (let i:number=0;i<songlist[i].artist_info.albums.length;i++)
                            {
                                console.log("Albums : "+songlist[i].artist_info.albums[i]); 
                            }
                    }
                break;
            case 2:
                let searchById:string = readline.question("Id : ")
                let found : boolean =false
                for (let i:number=0;i<songlist.length;i++)
                {
                    if(songlist[i].id == parseInt(searchById))
                    {
                        found=true;
                        console.log("Id : "+songlist[i].id);
                        console.log("Titel : "+songlist[i].title) ;
                        console.log("Artiest : "+songlist[i].artist);
                        console.log("Afbeelding : "+songlist[i].image_url);
                        console.log("Jaar : "+songlist[i].year);
                        console.log("Datum : "+songlist[i].release_date) ;
                        console.log("Weken nr1 : "+songlist[i].weeks_at_number_one);
                        console.log("Refrein : "+songlist[i].chorus) ;
                        console.log("Nr1 in de UK : "+songlist[i].number_1_in_UK);
                        console.log("Genre : "+songlist[i].genre) ;
                        for (let i:number=0;i<songlist[i].other_top_songs.length;i++)
                        {
                            console.log("Andere hits : "+songlist[i].other_top_songs[i]); 
                        }
                        console.log("Extra info "+songlist[i].artist+" : ") ;
                        console.log("\tEchte naam : "+songlist[i].artist_info.full_name);
                        console.log("\tGeboren in : "+songlist[i].artist_info.country) ;
                        console.log("\tGeboortedatum : "+songlist[i].artist_info.birthdate);
                        for (let i:number=0;i<songlist[i].artist_info.albums.length;i++)
                        {
                            console.log("Albums : "+songlist[i].artist_info.albums[i]); 
                        }
                    }                
                } 
                if (found==false)
                    {
                        console.log("Id niet gevonden");
                    }       
                break;
            case 3:
                break;
            default:
                console.log("Foute keuze")
                break;    
        }
    }
}
)





export {}