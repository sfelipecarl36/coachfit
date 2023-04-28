import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalhesfichaPage } from './detalhesficha.page';

const routes: Routes = [
  {
    path: '',
    component: DetalhesfichaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalhesfichaPageRoutingModule {}
