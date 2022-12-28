import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { SignedInGuard } from './guards/signed-in.guard';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { 
    path: 'login',
    component: LoginComponent,
    data: { hideDrawer: true, hideToolbar: true, animate: false },
  },
  { 
    path: 'login/token/:token',
    component: ChangePasswordComponent,
    data: { hideDrawer: true, hideToolbar: true, animate: false },
  },
  { path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [SignedInGuard, RoleGuard],
    data: { role: 'admin' }
  },
  { path: '**', redirectTo: '', canActivate: [SignedInGuard, RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
