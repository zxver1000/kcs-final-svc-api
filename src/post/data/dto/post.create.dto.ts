import { Post } from '@nestjs/common';
import { PickType } from '@nestjs/swagger';

export class PostCreateDto extends PickType(Post, [
  'title',
  'dates',
  'location',
  'weater',
  'outlay',
  'log',
] as const) {}
