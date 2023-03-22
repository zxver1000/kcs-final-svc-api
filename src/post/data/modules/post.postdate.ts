export class PostDate {
  protected from: Date;
  protected to: Date;
  //* Date Type
  //*
  constructor(from?: Date, to?: Date) {
    if (from) this.from = from;
    if (to) this.to = to;
  }

  serialize(): string {
    const obj = {
      from: this.from,
      to: this.to,
    };
    return JSON.stringify(obj);
  }
}

export const deserializePostDate = (target: object): PostDate => {
  if (!target) null;

  return new PostDate(target['from'], target['to']);
};
