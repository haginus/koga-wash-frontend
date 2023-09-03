import { MaterialKind } from "./types/Programme";
import { ReservationStatus } from "./types/Reservation";

export const USER_ROLES = {
  "admin": "Administrator",
  "user": "Utilizator",
  "system": "Sistem",
} as const;

export const MACHINE_TYPES = {
  "WashingMachine": "Mașină de spălat",
  "DryerMachine": "Uscător"
} as const;

export const PROGRAMME_MATERIAL_KINDS: Record<MaterialKind, string> = {
  [MaterialKind.COTTON]: "Bumbac",
  [MaterialKind.WOOL]: "Lână",
  [MaterialKind.SILK]: "Sătene",
  [MaterialKind.POLYESTER]: "Poliamidă",
  [MaterialKind.RAYON]: "Raiun",
  [MaterialKind.LINEN]: "Pânză",
  [MaterialKind.MIXED]: "Mixt",
} as const;

export const RESERVATION_STATUS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: "În așteptare",
  [ReservationStatus.CHECKED_IN]: "Începută",
  [ReservationStatus.FINISHED]: "Finalizată",
  [ReservationStatus.CANCELLED]: "Anulată",
  [ReservationStatus.NOT_HONORED]: "Neonorată",
} as const;

export const FLAG_REASONS = {
  "clothes_left_behind": "Haine lăsate în mașină",
} as const;

export const isMobile = window.innerWidth <= 768;