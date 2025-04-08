import { Collection } from './collection.model';
import { Tag } from './tags.model';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags: Tag[];
  collections: Collection[];
}
