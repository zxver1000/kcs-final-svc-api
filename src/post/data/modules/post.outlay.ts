import { deserializeLocation, Location } from './post.location';

export class Outlay {
  private date: Date;
  private location: Location;
  private amount: number;
  private memo: string;
  private title: string;

  constructor(
    date?: Date,
    location?: Location,
    amount?: number,
    memo?: string,
    title?: string,
  ) {
    if (date) this.date = date;
    if (location) this.location = location;
    if (amount) this.amount = amount;
    if (memo) this.memo = memo;
    if (title) this.title = title;
  }

  serialize(): string {
    const obj = {
      date: this.date,
      location: this.location,
      amount: this.amount,
      memo: this.memo,
      title: this.title,
    };
    return JSON.stringify(obj);
  }
}

export const deserializeOutlay = (target: object): Outlay => {
  if (!target || target == undefined) return null;

  let location = null;

  if (target['location'] && target['location'] instanceof Location) {
    location = deserializeLocation(target['location']);
  }

  return new Outlay(
    target['date'],
    location,
    target['amount'],
    target['memo'],
    target['title'],
  );
};
