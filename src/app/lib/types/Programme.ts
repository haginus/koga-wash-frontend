import { Machine } from "./Machine";

export interface Programme {
  id: string;
  name: string;
  wheelIndex: number;
  description: string;
  duration: number;
  materialKind: MaterialKind;
  machine: Machine;
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