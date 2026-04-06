import { Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { RoleGuard } from './services/role-guard';
import { User } from './user/user';
import { Login } from './login/login';
import { Error } from './error/error';

export const routes: Routes = [
    { path: 'admin', component: Admin, canActivate: [RoleGuard], data: { role: 'admin' } },
    { path: 'user', component: User, canActivate: [RoleGuard], data: { role: 'user' } },
    { path: 'login', component: Login },
      { path: 'error', component: Error },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
