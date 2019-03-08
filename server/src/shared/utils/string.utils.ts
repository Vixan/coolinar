import * as slug from 'slug';

export abstract class StringUtils {
  public static createSlug(text: string, options: any = {}) {
    return slug(text, options);
  }
}
