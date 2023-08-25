
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  room: string;
  role: Role;
  suspendedUntil: string;
}

export type Role = 'admin' | 'user' | 'system';