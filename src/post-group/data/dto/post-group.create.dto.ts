import { PickType } from '@nestjs/swagger';
import { PostGroup } from '../post-group.schema';

export class PostGroupCreateDto extends PickType(PostGroup, [
  'dates',
  'title',
  'preview',
] as const) {}
