export interface Songs 
{
        id: string,
        title: string,
        artist: string,
        image_url: string,	
        artist_info: Artist_info,
        year: number,
        release_date: string,
        weeks_at_number_one: number,
        chorus: string,
        number_1_in_UK: boolean,
        genre: Genre,
        other_top_songs: string[]
}

export interface Artist_info 
{
    id:number,
    full_name: string,
    country: string,
    birthdate: string,
    albums: string[]   

}

export type Genre = "POP" | "RNB" | "HIP_HOP" | "EDM" | "COUNTRY" | "FUNK";

