import { Outlay } from './post.Outlay';
import { PostDate } from './post.PostDate';
import { Post } from './post.schema';
import { Weather } from './post.Weather';

export interface PostAdapter {
  Weather: Weather;
  Outlay: Outlay;
  PostDate: PostDate;
}

export class Adapter implements PostAdapter {
  Weather: Weather;
  Outlay: Outlay;
  PostDate: PostDate;
}
