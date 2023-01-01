import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { MACHINE_TYPES } from 'src/app/lib/constants';
import { Machine } from 'src/app/lib/types/Machine';
import { MachinesService } from 'src/app/services/machines.service';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit {

  constructor(private machinesService: MachinesService, private router: Router) { }

  displayedColumns: string[] = ['kind', 'make', 'model', 'actions'];
  data: Machine[] = [];
  isLoadingResults = true;

  MACHINE_TYPES = MACHINE_TYPES;

  performedActions: BehaviorSubject<string> = new BehaviorSubject('');

  ngOnInit(): void {
    this.performedActions.pipe(
      switchMap(() => {
        this.isLoadingResults = true;
        return this.machinesService.findAll()
      })
    ).subscribe(machines => {
      this.isLoadingResults = false;
      this.data = machines;
    });
  }

  refreshResults() {
    this.performedActions.next("refresh");
  }

  addMachine() {
    this.router.navigate(["admin", "machines", "create"]);
  }

  goToMachine(machine: Machine) {
    this.router.navigate(["admin", "machines", machine.id]);
  }

}
