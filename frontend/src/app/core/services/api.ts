export const API_URL = '/api';

export type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  username?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  joinedDate?: string;
};

export type Access = Record<string, boolean | string>;
