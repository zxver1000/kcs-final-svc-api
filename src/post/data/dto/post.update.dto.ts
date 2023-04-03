import { PickType } from '@nestjs/swagger';
import { Post } from '../post.schema';

export class PostUpdateDto extends PickType(Post, [
  'id',
  'preview',
  'title',
  'location',
  'dates',
  'outlay',
  'weather',
  'log',
] as const) {}
