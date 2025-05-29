export type User = {
  userId: string;
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LoginCredentials = {
  email: string;
  password: string;
};
