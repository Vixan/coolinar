import { User } from './user.model';

export class Review {
  text: string;
  author: User;
  score: number;

  constructor(props: any) {
    Object.assign(this, props);
  }
}
