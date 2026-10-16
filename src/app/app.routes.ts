import { Routes } from '@angular/router';
import { Home } from './modules/pages/home/home';
import { Login } from './modules/pages/login/login';
import { CineifNavbar } from './modules/layout/cineif-navbar/cineif-navbar';
import { Register } from './modules/pages/register/register';

export const routes: Routes = [
  {
    path: '',
    component: CineifNavbar,
    children: [
      {
        path: '',
        component: Home,
      },
    ],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cadastro',
    component: Register
  },
];
