import { PaginatedQuery } from "../PaginatedQuery";
import { ReservationStatus } from "../Reservation";

export interface ReservationQueryDto extends PaginatedQuery {
  instanceId?: string;
  since?: string;
  until?: string;
  userId?: string;
  status?: ReservationStatus;
  sortBy?: 'id' | 'startTime' | 'machineInstance.name' | 'user.lastName' | 'programme.name' | 'status';
  sortDirection?: 'ASC' | 'DESC';
}