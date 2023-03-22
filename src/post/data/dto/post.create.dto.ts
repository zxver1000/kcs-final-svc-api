import { PickType } from '@nestjs/swagger';
import { Post } from '../post.schema';

export class PostCreateDto extends PickType(Post, [
  'title',
  'dates',
  'location',
  'outlay',
  'log',
  'Weather',
] as const) {}
