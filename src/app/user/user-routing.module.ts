import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from '../shared/reservation/reservation.component';
import { SlotsLookupComponent } from '../shared/slots-lookup/slots-lookup.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';

const routes: Routes = [
  { path: 'reservations', component: ReservationsComponent, data: { title: 'Rezervări' } },
  { path: 'reservations/:id', component: ReservationComponent, data: { title: 'Rezervări' } },
  { path: 'slots-lookup', component: SlotsLookupComponent, data: { title: 'Rezervare' }, },
  { path: '**', redirectTo: "slots-lookup" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
