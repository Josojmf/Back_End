import { getCharacters } from "./rickmortyapi";
import { Character, Episode, EpisodeAPI, CharacterAPI } from "./types";

export async function characters(parent:any,args:any,context:any){
    let next: string = "https://rickandmortyapi.com/api/character";
    while (next) {
      const data: { next: string; characters: Character[] } =
        await getCharacters(next);
      const characters:Character[] = data.characters.map((char) => {
        const { id, name, status, species, episode } = char;
        return {
          id,
          name,
          status,
          species,
          episode,
        };
      });
      next = data.next;
      return (characters)
}
}

export async function character(parent:any,args:{id:string},context:any){
    let next: string = "https://rickandmortyapi.com/api/character";
    while (next) {
      const data: { next: string; characters: Character[] } = await getCharacters(next);
      const characters:Character[] = data.characters.map((char) => {
        const { id, name, status, species, episode } = char;
        return {
          id,
          name,
          status,
          species,
          episode,
        };
      });  
      next = data.next;   
    const resu= characters.filter((char) => {
        return char.id == args.id;
    })[0]
    if(resu!=null)return (resu) as Character 
} 

}

export async function charactersByIds(parent:any,args:{ids:number[]},context:any){
    let next: string = "https://rickandmortyapi.com/api/character";
    while (next) {
      const data: { next: string; characters: Character[] } = await getCharacters(next);
      const characters:Character[] = data.characters.map((char) => {
        const { id, name, status, species, episode } = char;
        return {
          id,
          name,
          status,
          species,
          episode,
        };
      });  
    next = data.next; 
    if(characters){
        const resu= characters.filter((char) => {
            return args.ids.includes(parseInt(char.id))
        })
        if(resu!=null)return (resu) as Character[];
    }  else{
        return []
    }

} 
}