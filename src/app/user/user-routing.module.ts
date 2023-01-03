import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvailableInstancesComponent } from '../shared/available-instances/available-instances.component';
import { ReservationComponent } from '../shared/reservation/reservation.component';
import { SlotsLookupComponent } from '../shared/slots-lookup/slots-lookup.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';

const routes: Routes = [
  { path: 'machine-status', component: AvailableInstancesComponent, data: { title: 'Stare mașini' } },
  { path: 'reservations', component: ReservationsComponent, data: { title: 'Rezervări' } },
  { path: 'reservations/:id', component: ReservationComponent, data: { title: 'Rezervări' } },
  { path: 'slots-lookup', component: SlotsLookupComponent, data: { title: 'Rezervare' }, },
  { path: '**', redirectTo: "reservations" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
