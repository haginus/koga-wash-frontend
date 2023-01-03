import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { ReservationSnippetComponent } from './components/reservation-snippet/reservation-snippet.component';

const materialDeps = [
  MatTabsModule
]

@NgModule({
  declarations: [
    ReservationsComponent,
    ReservationSnippetComponent
  ],
  imports: [
    ...materialDeps,
    CommonModule,
    UserRoutingModule,
    SharedModule,
  ]
})
export class UserModule { }
