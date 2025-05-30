export type LoginDTO = {
  email: string;
  password: string;
};
export type SignupDTO = {
  email: string;
  password: string;
  username: string;
  role: string;
};

export interface LoginResponse {
  token: string;
  expiration: string;
}
