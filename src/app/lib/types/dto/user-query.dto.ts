import { PaginatedQuery } from "../PaginatedQuery";

export interface UserQueryDto extends PaginatedQuery {
  firstName?: string;
  lastName?: string;
  email?: string;
}