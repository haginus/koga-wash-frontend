import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvailableInstancesComponent } from '../shared/available-instances/available-instances.component';
import { ReservationComponent } from '../shared/reservation/reservation.component';
import { SlotsLookupComponent } from '../shared/slots-lookup/slots-lookup.component';
import { MachineComponent } from './pages/machine/machine.component';
import { MachinesComponent } from './pages/machines/machines.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent, data: { title: 'Utilizatori' } },
  { path: 'machines', component: MachinesComponent, data: { title: 'Mașini' } },
  { path: 'machines/create', component: MachineComponent, data: { title: 'Mașini' } },
  { path: 'machines/:id', component: MachineComponent, data: { title: 'Mașini' } },
  { path: 'reservations', component: ReservationsComponent, data: { title: 'Rezervări' }, },
  { path: 'reservations/:id', component: ReservationComponent, data: { title: 'Rezervări' } },
  { path: 'machine-status', component: AvailableInstancesComponent, data: { title: 'Stare mașini' } },
  { path: 'slots-lookup', component: SlotsLookupComponent, data: { title: 'Rezervare' }, },
  { path: '**', redirectTo: "users" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
