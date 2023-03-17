import { PickType } from '@nestjs/swagger';
import { Outlay } from '../post.Outlay';
import { Post } from '../post.schema';
import { Weather } from '../post.Weather';

export interface LightPost_ {
  Outlay: Outlay;
  owner: string;
}

export class LightPostDto implements LightPost_ {
  Outlay: Outlay = null;
  owner: string = null;
  file_id: string[] = null;
}
