import { ApolloError } from "apollo-server";
import axios from "axios";
import { Collection } from "mongodb";
import { Character, Episode, EpisodeAPI, CharacterAPI } from "../types";


export const Query = {
characters: async(parent:any,args:any,context:any)=>{
  let data:any;
 console.log(await getCharacters('https://rickandmortyapi.com/api/character'))
  return((await axios.get<any, { data: any }>('https://rickandmortyapi.com/api/character')).data);
 
},
character: async(parent:any,args:{id:String},context:any)=>{
  return( (await axios.get<any, { data: any }>(`https://rickandmortyapi.com/api/character/${args.id}`)).data)
},
charactersByIds: async(parent:any,args:{ids:Array<any>},context:any)=>{
  console.log(args.ids)
  let format:String="";
  
  for(let i:number = 0 ; i< args.ids.length;i++){
    format=format+","+args.ids[i];
  }
  format=format.substring(1);
  return( (await axios.get<any, { data: any }>(`https://rickandmortyapi.com/api/character/${format}`)).data)
}

}
export const getEpisode = async (url: string): Promise<Episode> => {
  try {
    return (await axios.get<any, { data: EpisodeAPI }>(url)).data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
export const getEpisodes = async (urls: string[]): Promise<Array<Episode>> => {
  try {
    return await Promise.all(urls.map((url) => getEpisode(url)));
  } catch (e) {
    console.error(e);
    throw e;
  }
};
export const getCharacters = async (
  url: string
): Promise<{
  next: string;
  characters: Character[];
}> => {
  try {
    const data: { info: { next: string }; results: CharacterAPI[] } = (
      await axios.get<
        any,
        { data: { info: { next: string }; results: CharacterAPI[] } }
      >(url)
    ).data;
    const charactersAPI: CharacterAPI[] = data.results;
    const characters: Character[] = await Promise.all(
      charactersAPI.map(async (charAPI) => {
        const episodes: Episode[] = await getEpisodes(charAPI.episode);
        return {
          ...charAPI,
          episode: episodes,
        };
      })
    );
    return {
      next: data.info.next,
      characters,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};