import { Routes } from '@angular/router';
import { CustomerForm } from './customer-form/customer-form';
import { CustomerList } from './customer-list/customer-list';
import { Login } from './login/login';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'customers', component: CustomerList, canActivate: [authGuard] },
  { path: 'customers/new', component: CustomerForm, canActivate: [authGuard] },
  { path: 'customers/:id/edit', component: CustomerForm, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
