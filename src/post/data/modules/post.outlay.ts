export class SingleOutlay {
  private date: string;
  private cost: number;
  private memo: string;
  private title: string;

  constructor(date?: string, cost?: number, memo?: string, title?: string) {
    if (date) this.date = date;
    if (cost) this.cost = cost;
    if (memo) this.memo = memo;
    if (title) this.title = title;
  }

  serialize(): string {
    const obj = {
      date: this.date,
      cost: this.cost,
      memo: this.memo,
      title: this.title,
    };
    return JSON.stringify(obj);
  }
}

export const deserializeSingleOutlay = (target: object): SingleOutlay => {
  if (!target) return null;

  return new SingleOutlay(
    target['date'],
    target['cost'],
    target['memo'],
    target['title'],
  );
};

export class Outlay {
  private cost: number;
  private title: string;
  private outlays: SingleOutlay[];

  constructor(title?: string, cost?: number, outlays?: SingleOutlay[]) {
    if (title) this.title = title;
    if (cost) this.cost = cost;
    if (outlays) this.outlays = outlays;
  }

  serialize(): string {
    const obj = {
      title: this.title,
      cost: this.cost,
      outlays: this.outlays,
    };
    return JSON.stringify(obj);
  }
}

export const deserializeOutlay = (target: object): Outlay => {
  if (!target) return null;

  const outlays = [];

  if (target['outlays']) {
    try {
      for (let i = 0; i < target['outlays'].length; i++) {
        const outlay = deserializeSingleOutlay(target['outlays'][i]);
        outlays.push(outlay);
      }
    } catch (ignore) {}
  }

  return new Outlay(target['title'], target['cost'], outlays);
};
