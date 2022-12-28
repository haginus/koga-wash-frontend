import { User } from "./User";

export interface AuthResponse {
  access_token?: string;
  user?: User;
  error?: any 
}