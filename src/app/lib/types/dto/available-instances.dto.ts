import { MachineInstance } from "../MachineInstance";

export type AvailableInstancesDto = {
  instance: MachineInstance;
  availableUntil?: Date;
  busyUntil?: Date;
}