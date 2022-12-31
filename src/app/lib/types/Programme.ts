export interface Programme {
  id: string;
  name: string;
  wheelIndex: number;
  description: string;
  duration: number;
  materialKind: MaterialKind;
}

export enum MaterialKind {
  COTTON = "COTTON",
  WOOL = "WOOL",
  SILK = "SILK",
  POLYESTER = "POLYESTER",
  RAYON = "RAYON",
  LINEN = "LINEN",
  MIXED = "MIXED",
}