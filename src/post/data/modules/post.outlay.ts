import { Location, LocationDeserialization } from './post.location';

export class Outlay {
  constructor(
    data?: Date,
    location?: Location,
    amount?: number,
    memo?: string,
    title?: string,
  ) {
    if (data) this.data = data;
    if (location) this.location = location;
    if (amount) this.amount = amount;
    if (memo) this.memo = memo;
    if (title) this.title = title;
  }

  data: Date = null;
  location: Location = null;
  amount: number = null;
  memo: string = null;
  title: string = null;
}

export function OutLaySerialization(O: Outlay): string {
  return JSON.stringify(O);
}

export function OutLayDeserialization(deserial: object): Outlay {
  if (!deserial) return new Outlay();

  const result = new Outlay();
  if (deserial['data'] != undefined) result.data = deserial['data'];
  if (deserial['location'] != undefined) {
    deserial['location'] = LocationDeserialization(deserial['location']);
    result.location = deserial['location'];
  }
  if (deserial['amount'] != undefined) result.location = deserial['amount'];
  if (deserial['memo'] != undefined) result.memo = deserial['memo'];
  if (deserial['title'] != undefined) result.title = deserial['title'];

  return result;
}
