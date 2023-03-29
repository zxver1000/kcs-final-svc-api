export class PostPreview {
  id: string;
  path: string;
  // private temperature: Temperature;
  constructor(id?: string, path?: string) {
    if (id) this.id = id;
    this.path = path ? path : '/img/logo.png';
  }

  serialize(): string {
    const obj = {
      id: this.id,
      path: this.path,
    };
    return JSON.stringify(obj);
  }
}

export const deserializePostPreview = (target: object): PostPreview => {
  if (!target) return null;

  return new PostPreview(target['id'], target['path']);
};

export const defaultPreview: PostPreview = new PostPreview();
