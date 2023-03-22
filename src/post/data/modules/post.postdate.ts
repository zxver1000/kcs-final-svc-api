export class PostDate {
  constructor(from?: Date, to?: Date) {
    if (from) this.from = from;
    if (to) this.to = to;
  }

  from: Date = null;
  to: Date = null;
}

export function PostDateSerialization(O: object): string {
  return JSON.stringify(O);
}
export function PostDateDeserialization(deserial: object): PostDate {
  if (!deserial) return new PostDate();

  const result = new PostDate();
  if (deserial['from']) result.from = deserial['from'];
  if (deserial['to']) result.to = deserial['to'];

  return result;
}
