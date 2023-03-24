export class PostDate {
  protected from: string;
  protected to: string;
  //* Date Type
  //*
  constructor(from?: string, to?: string) {
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
  if (!target) return null;

  return new PostDate(target['from'], target['to']);
};
