export class PostText {
  private uuid: string;
  private owner: string;
  private text: string;
  private fileid: string;
  private filepath: string;
  constructor(
    uuid?: string,
    owner?: string,
    text?: string,
    fileid?: string,
    filepath?: string,
  ) {
    if (uuid) this.uuid = uuid;
    if (owner) this.owner = owner;
    if (text) this.text = text;
    if (fileid) this.fileid = fileid;
    if (filepath) this.filepath = filepath;
  }

  serialize(): string {
    const obj = {
      uuid: this.uuid,
      owner: this.owner,
      text: this.text,
      fileid: this.fileid,
      filepath: this.filepath,
    };
    return JSON.stringify(obj);
  }

  setOwner(owner: string) {
    this.owner = owner;
  }
}

export const deserializePostText = (target: object): PostText => {
  if (!target) return null;

  return new PostText(
    target['uuid'],
    target['owner'],
    target['text'],
    target['fileid'],
    target['filepath'],
  );
};
