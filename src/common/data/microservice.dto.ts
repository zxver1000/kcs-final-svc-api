import { LightPostDto } from 'src/post/data/dto/LightPostDto';
import { Post } from 'src/post/data/post.schema';

export interface MicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: Post[] | boolean | LightPostDto[];
}
