import { MaterialKind } from "./types/Programme";
import { ReservationStatus } from "./types/Reservation";

export const USER_ROLES = {
  "admin": "Administrator",
  "user": "Utilizator",
  "system": "Sistem",
}

export const MACHINE_TYPES = {
  "WashingMachine": "Mașină de spălat",
  "DryerMachine": "Uscător"
}

export const PROGRAMME_MATERIAL_KINDS: Record<MaterialKind, string> = {
  [MaterialKind.COTTON]: "Bumbac",
  [MaterialKind.WOOL]: "Lână",
  [MaterialKind.SILK]: "Sătene",
  [MaterialKind.POLYESTER]: "Poliamidă",
  [MaterialKind.RAYON]: "Raiun",
  [MaterialKind.LINEN]: "Lână",
  [MaterialKind.MIXED]: "Mixt",
}

export const RESERVATION_STATUS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: "În așteptare",
  [ReservationStatus.CHECKED_IN]: "Începută",
  [ReservationStatus.FINISHED]: "Finalizată",
  [ReservationStatus.CANCELLED]: "Anulată",
  [ReservationStatus.NOT_HONORED]: "Neonorată",
}

export const isMobile = window.innerWidth <= 768;