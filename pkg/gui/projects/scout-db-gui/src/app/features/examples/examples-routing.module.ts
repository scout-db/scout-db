import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../../core/core.module';

import { ExamplesComponent } from './examples/examples.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { FormComponent } from './form/components/form.component';

const routes: Routes = [
  {
    path: '',
    component: ExamplesComponent,
    children: [
      {
        path: 'form',
        component: FormComponent,
        data: { title: 'sdbg.examples.menu.form' }
      },
      {
        path: 'authenticated',
        component: AuthenticatedComponent,
        canActivate: [AuthGuardService],
        data: { title: 'sdbg.examples.menu.auth' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamplesRoutingModule {}
