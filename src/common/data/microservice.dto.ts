import { PostReadOnly } from 'src/post/data/post.schema';

export interface MicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: PostReadOnly[] | boolean;
}
