import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'scout-form',
    loadComponent: () => import('./scout-form/scout-form.page').then( m => m.ScoutFormPage)
  },
];
