import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from "@angular/material/table";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './pages/users/users.component';
import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlRo } from '../providers/mat-paginator-intl-ro';
import { UserDialogComponent } from './dialogs/user-dialog/user-dialog.component';
import { MachinesComponent } from './pages/machines/machines.component';
import { MachineComponent } from './pages/machine/machine.component';
import { ProgrammeDialogComponent } from './dialogs/programme-dialog/programme-dialog.component';
import { InstanceDialogComponent } from './dialogs/instance-dialog/instance-dialog.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';


const materialDeps = [
  MatTableModule,
  MatPaginatorModule,
  MatSlideToggleModule,
]

@NgModule({
  declarations: [
    UsersComponent,
    UserDialogComponent,
    MachinesComponent,
    MachineComponent,
    ProgrammeDialogComponent,
    InstanceDialogComponent,
    ReservationsComponent,
  ],
  imports: [
    ...materialDeps,
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlRo },
  ]
})
export class AdminModule { }
