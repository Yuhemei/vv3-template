export interface User {
  id: string;
  name: string;
  password?: string;
  email?: string;
  phone?: string;
  role?: string;
  date?: string;
  nickName?: string;
  avatar?: string;
  roleList?: any[];
  uuid?: string;
}

export interface Register {
  username: string;
  password: string;
  email: string;
}
