import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MACHINE_TYPES } from 'src/app/lib/constants';
import { Machine } from 'src/app/lib/types/Machine';
import { Programme } from 'src/app/lib/types/Programme';
import { MachinesService } from 'src/app/services/machines.service';
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
  ) { }

  machine: Machine = {
    id: undefined,
    model: "Model",
    make: "Make",
    kind: "WashingMachine",
  }

  performedActions: BehaviorSubject<string> = new BehaviorSubject('');

  MACHINE_TYPES = MACHINE_TYPES;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.machinesService.findOne(params.id).subscribe(machine => {
          if(!machine) {
            this.goToList();
            return;
          }
          this.machine = machine;
        });
      }
    });
  }

  goToList() {
    this.router.navigate(["admin", "machines"]);
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

}
