import { PickType } from '@nestjs/swagger';
import { Post } from '../post.schema';

export class PostCreateDto extends PickType(Post, [
  'owner',
  'title',
  'location',
  'dates',
  'outlay',
  'weather',
  'log',
] as const) {}
