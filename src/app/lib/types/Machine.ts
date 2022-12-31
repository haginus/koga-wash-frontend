import { MachineInstance } from "./MachineInstance";
import { Programme } from "./Programme";

export interface Machine {
  id: string;
  make: string;
  model: string;
  kind: 'WashingMachine' | 'DryerMachine';
  instances?: MachineInstance[];
  programmes?: Programme[];
}