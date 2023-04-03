import { PickType } from '@nestjs/swagger';
import { PostGroup } from '../post-group.schema';

export class PostGroupUpdateDto extends PickType(PostGroup, [
  'id',
  'dates',
  'title',
  'preview',
  'posts',
] as const) {}
