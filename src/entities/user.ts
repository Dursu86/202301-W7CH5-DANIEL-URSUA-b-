export type User = {
  id: string;
  name: string;
  age: string;
  gender: string;
  email: string;
  passwd: string;
  friends: User[];
  enemies: User[];
};
