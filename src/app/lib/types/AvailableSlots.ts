import { MachineInstance } from "./MachineInstance";

export interface AvailableSlots {
  instance: MachineInstance;
  slots: string[];
}