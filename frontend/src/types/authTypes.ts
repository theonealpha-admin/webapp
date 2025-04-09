export interface User {
  id: string;
  prefix: string;
  email: string;
  fullname: string;
  role: number;
}

export interface UserResponse {
  message: string;
  user: User;
}
