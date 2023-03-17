import { Prop } from '@nestjs/mongoose';

export class PostDate {
  constructor(from?: Date, to?: Date) {
    if (from) this.from = from;
    if (to) this.to = to;
  }
  @Prop()
  from: Date = null;

  @Prop()
  to: Date = null;
}

export function PostDateSerialization(O: object): string {
  return JSON.stringify(O);
}
export function PostDateDeserialization(deserial: object): PostDate {
  let return_val = new PostDate();
  if (deserial['from']) return_val.from = deserial['from'];
  if (deserial['to']) return_val.to = deserial['to'];

  return return_val;
}
