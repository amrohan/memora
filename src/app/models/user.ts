export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}
