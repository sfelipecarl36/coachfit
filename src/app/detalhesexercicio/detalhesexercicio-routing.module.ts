import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalhesexercicioPage } from './detalhesexercicio.page';

const routes: Routes = [
  {
    path: '',
    component: DetalhesexercicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalhesexercicioPageRoutingModule {}
