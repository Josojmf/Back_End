//This are the types you are recieving FROM THE EXTERNAL API

export type CharacterAPI = {
    id: string;
    name: string;
    status: string;
    species: string;
    episode: Array<Episode>;
  };
  
  export type EpisodeAPI = {
    name: string;
    episode: string;
  };
  
  export type Character = Omit<CharacterAPI, "episode"> & {
    episode: Array<EpisodeAPI>;
  };
  export type Episode = EpisodeAPI;
