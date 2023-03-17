import { Prop } from '@nestjs/mongoose';
import { Location, LocationDeserialization } from './post.Location';

export class Outlay {
  constructor(
    data?: Date,
    location?: Location,
    amount?: Number,
    memo?: string,
    title?: string,
  ) {
    if (data) this.data = data;
    if (location) this.location = location;
    if (amount) this.amount = amount;
    if (memo) this.memo = memo;
    if (title) this.title = title;
  }
  @Prop()
  data: Date = null;

  @Prop()
  location: Location = null;

  @Prop()
  amount: Number = null;

  @Prop()
  memo: string = null;

  @Prop()
  title: string = null;
}

export function OutLaySerialization(O: Outlay): string {
  return JSON.stringify(O);
}

export function OutLayDeserialization(deserial: object): Outlay {
  //let deserial = JSON.parse(str);

  let return_value = new Outlay();
  if (deserial['data']) return_value.data = deserial['data'];
  if (deserial['location']) {
    deserial['location'] = LocationDeserialization(deserial['location']);
    return_value.location = deserial['location'];
  }
  if (deserial['amount']) return_value.location = deserial['amount'];
  if (deserial['memo']) return_value.memo = deserial['memo'];
  if (deserial['title']) return_value.title = deserial['title'];

  return return_value;
}
