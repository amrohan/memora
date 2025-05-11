export interface Collection {
  id: string;
  name: string;
  isSystem: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
