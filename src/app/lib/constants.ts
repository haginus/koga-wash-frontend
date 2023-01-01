import { MaterialKind } from "./types/Programme"

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