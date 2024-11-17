export interface User {
  createdOn: string;
  id: string;
  lastSeenOn: string;
  username: string;
}

export interface Users {
  [id: string]: User;
}
