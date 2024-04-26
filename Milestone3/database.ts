import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import {Songs} from "./interfaces/songs";
dotenv.config();

export const client = new MongoClient("mongodb+srv://s004935:APHS2023@webo1.sjzote7.mongodb.net/");
export const collection:Collection<Songs>=client.db("Milestone").collection<Songs>("Milestone3");

export async function getSongs()
{
    return await collection.find({}).toArray();
}


export async function fillDB()
{
    const songs:Songs[]=await getSongs();
    if (songs.length==0)
    {
        let response = await fetch("https://raw.githubusercontent.com/BergenChris/Milestone/main/Milestone2/songs.json");
        let songlist:Songs[]= await response.json();
        await collection.insertMany(songlist);
    }
    
}


export async function connect() 
{
    try {
        await client.connect();
        await fillDB();   
        console.log("DB-verbinding opgestart");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}

async function exit() {
    try {
        await client.close();
        console.log("DB-verbinding verbroken");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}