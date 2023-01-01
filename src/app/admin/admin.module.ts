import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from "@angular/material/table";
import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './pages/users/users.component';
import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlRo } from '../providers/mat-paginator-intl-ro';
import { UserDialogComponent } from './dialogs/user-dialog/user-dialog.component';


const materialDeps = [
  MatTableModule,
  MatPaginatorModule,
]

@NgModule({
  declarations: [
    UsersComponent,
    UserDialogComponent
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
