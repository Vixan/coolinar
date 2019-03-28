import { Injectable } from '@nestjs/common';
import * as slug from 'slug';

@Injectable()
export class SlugProvider {
  createSlug(text: string, options: any = {}) {
    return slug(text, options);
  }
}
