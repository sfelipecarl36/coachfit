import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeutreinoPage } from './meutreino.page';

const routes: Routes = [
  {
    path: '',
    component: MeutreinoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeutreinoPageRoutingModule {}
