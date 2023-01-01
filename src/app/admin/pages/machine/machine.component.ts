import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MACHINE_TYPES } from 'src/app/lib/constants';
import { Machine } from 'src/app/lib/types/Machine';
import { MachineInstance } from 'src/app/lib/types/MachineInstance';
import { Programme } from 'src/app/lib/types/Programme';
import { MachinesService } from 'src/app/services/machines.service';
import { InstanceDialogComponent, InstanceDialogData } from '../../dialogs/instance-dialog/instance-dialog.component';
import { ProgrammeDialogComponent, ProgrammeDialogData } from '../../dialogs/programme-dialog/programme-dialog.component';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.scss']
})
export class MachineComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private machinesService: MachinesService,
    private snackbar: MatSnackBar,
  ) { }

  machine: Machine = {
    id: undefined,
    make: "Make",
    model: "Model",
    kind: "WashingMachine",
    programmes: [],
    instances: [],
  }

  isLoading = true;
  isEditing = false;
  machineForm = new FormGroup({
    make: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    kind: new FormControl('', [Validators.required]),
  });

  MACHINE_TYPES = MACHINE_TYPES;

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      if(params.id) {
        this.machinesService.findOne(params.id).subscribe(machine => {
          if(!machine) {
            this.goToList();
            return;
          }
          this.machine = machine;
        });
      } else {
        this.isEditing = true;
      }
      this.isLoading = false;
    });
  }

  goToList() {
    this.router.navigate(["admin", "machines"]);
  }

  editMahine() {
    this.isEditing = true;
    this.machineForm.setValue({
      make: this.machine.make,
      model: this.machine.model,
      kind: this.machine.kind,
    });
  }

  saveMachine() {
    const machine = {
      ...this.machine,
      ...this.machineForm.value,
    };
    const observable = this.machine.id ? this.machinesService.update(machine) : this.machinesService.create(machine);
    observable.subscribe((machine) => {
      if(!machine) {
        return;
      }
      if(!this.machine.id) {
        this.router.navigate(["admin", "machines", machine.id]);
      }
      this.machine = machine;
      this.isEditing = false;
      this.snackbar.open("Mașina a fost salvată.");
    });
  }

  addProgramme() {
    const dialogRef = this.dialog.open<ProgrammeDialogComponent, ProgrammeDialogData>(ProgrammeDialogComponent, {
      data: {
        mode: "create",
        machineId: this.machine.id,
      }
    });
    dialogRef.afterClosed().subscribe((programme) => {
      if(!programme) return;
      this.machine.programmes = [...this.machine.programmes, programme];
    });
  }

  editProgramme(programme: Programme) {
    const dialogRef = this.dialog.open<ProgrammeDialogComponent, ProgrammeDialogData, Programme | null | undefined>(ProgrammeDialogComponent, {
      data: { 
        mode: "edit",
        programme: programme,
        machineId: this.machine.id,
      }
    });
    dialogRef.afterClosed().subscribe((programmeResult) => {
      if(programmeResult === undefined) return;
      if(programmeResult === null) {
        this.machine.programmes = this.machine.programmes.filter(p => p.id !== programme.id);
      } else {
        this.machine.programmes = this.machine.programmes.map(p => p.id === programmeResult.id ? programmeResult : p);
      }
    });
  }

  addInstance() {
    const dialogRef = this.dialog.open<InstanceDialogComponent, InstanceDialogData>(InstanceDialogComponent, {
      data: {
        mode: "create",
        machineId: this.machine.id,
      }
    });
    dialogRef.afterClosed().subscribe((instance) => {
      if(!instance) return;
      this.machine.instances = [...this.machine.instances, instance];
    });
  }

  editInstance(instance: MachineInstance) {
    const dialogRef = this.dialog.open<InstanceDialogComponent, InstanceDialogData, MachineInstance | null | undefined>(InstanceDialogComponent, {
      data: { 
        mode: "edit",
        instance,
        machineId: this.machine.id,
      }
    });
    dialogRef.afterClosed().subscribe((instanceResult) => {
      if(instanceResult === undefined) return;
      if(instanceResult === null) {
        this.machine.instances = this.machine.instances.filter(p => p.id !== instance.id);
      } else {
        this.machine.instances = this.machine.instances.map(p => p.id === instanceResult.id ? instanceResult : p);
      }
    });
  }

}
