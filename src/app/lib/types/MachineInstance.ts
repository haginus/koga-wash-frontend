import { Machine } from "./Machine";

export interface MachineInstance {
  id: string;
  name: string;
  isFaulty: boolean;
  machine: Machine;
}