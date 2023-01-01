import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlotsLookupComponent } from '../shared/slots-lookup/slots-lookup.component';
import { MachineComponent } from './pages/machine/machine.component';
import { MachinesComponent } from './pages/machines/machines.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent, data: { title: 'Utilizatori' } },
  { path: 'machines', component: MachinesComponent, data: { title: 'Mașini' } },
  { path: 'machines/create', component: MachineComponent, data: { title: 'Mașini' } },
  { path: 'machines/:id', component: MachineComponent, data: { title: 'Mașini' } },
  { path: 'slots-lookup', component: SlotsLookupComponent, data: { title: 'Programare' }, },
  { path: '**', redirectTo: "users" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
