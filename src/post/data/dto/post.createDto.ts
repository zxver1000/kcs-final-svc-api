import { Outlay } from '../post.Outlay';
import { Weather } from '../post.Weather';
import { PostDate } from '../post.PostDate';
export class PostCreateDto {
  owner: string;
  Weather: Weather;
  Outlay: Outlay;
  PostDate: PostDate;
  fileId: string[] = [];
}
