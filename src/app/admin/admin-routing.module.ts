import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlotsLookupComponent } from '../shared/slots-lookup/slots-lookup.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'slots-lookup',
    data: {
      title: 'Programare'
    },
    component: SlotsLookupComponent,
  },
  {
    path: '**',
    redirectTo: "users"
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
