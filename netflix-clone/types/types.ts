export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
export interface Movie {
  id: string;
  publicId: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  videoUrl: string | null;
  cloudinaryId: string | null;
  duration: number | null;
  releaseYear: number | null;
  maturityRating: string | null;
  isTrending: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  supabaseId: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  profiles?: Profile[];
}

export interface Profile {
  id: string;
  name: string;
  avatarUrl: string | null;
  isKids: boolean;
  userId: string;
  createdAt: Date;
  user?: User;
  watchHistory?: WatchHistory[];
  myList?: MyList[];
}

export interface MyList {
  id: string;
  profileId: string;
  movieId: string | null;
  tvShowId: string | null;
  addedAt: Date;
  profile?: Profile;
  movie?: Movie | null;
 
}

export interface WatchHistory {
  id: string;
  profileId: string;
  movieId: string | null;
  episodeId: string | null;
  progress: number;
  duration: number;
  watchedAt: Date;
  lastWatchedAt: Date;
  profile?: Profile;
  movie?: Movie | null;
}


export type UpdateMovie = Partial<Omit<
Movie, 
| "id" 
| "createdAt"
| "publicId" 
| "cast"  
| "watchHistory" 
| "myList"
| "genres" 
>    
>;    