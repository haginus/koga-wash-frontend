import { MachineInstance } from "./MachineInstance";
import { Programme } from "./Programme";
import { Role, User } from "./User";

export interface Reservation {
  id: string;
  machineInstance: MachineInstance;
  user: User;
  programme: Programme;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  meta: ReservationMeta;
}

export enum ReservationStatus {
  PENDING = "PENDING",
  CHECKED_IN = "CHECKED_IN",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
  NOT_HONORED = "NOT_HONORED",
}

interface ReservationMeta {
  checkedInAt?: Date;
  checkedOutAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: Role;
  flags: ReservationMetaFlag[];
}

interface ReservationMetaFlag {
  flaggedAt: Date;
  flaggedByUserId: string;
  flagReason: FlagReason;
}

type FlagReason = 'clothes_left_behind';