export class PostText {
  private owner: string;
  private text: string;
  private fileid: string;
  private filepath: string;
  constructor(
    owner?: string,
    text?: string,
    fileid?: string,
    filepath?: string,
  ) {
    if (owner) this.owner = owner;
    if (text) this.text = text;
    if (fileid) this.fileid = fileid;
    if (filepath) this.filepath = filepath;
  }

  serialize(): string {
    const obj = {
      owner: this.owner,
      text: this.text,
      fileid: this.fileid,
      filepath: this.filepath,
    };
    return JSON.stringify(obj);
  }

  getPreview(): string {
    return this.filepath;
  }
}

export const deserializePostText = (target: object): PostText => {
  if (!target || target == undefined) return null;

  return new PostText(
    target['owner'],
    target['text'],
    target['fileid'],
    target['filepath'],
  );
};
